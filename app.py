from flask import Flask, request, redirect, url_for, render_template, session, flash
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sqlite3
import bcrypt
import secrets
from pathlib import Path

app = Flask(__name__)
app.secret_key = "clave_super_secreta"  # necesaria para session

DB_PATH = "DB/usuario.db"

# ----------------------------
# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "home"  # ruta a la que redirige si no está logueado

class User(UserMixin):
    """
    User object para flask-login.
    id -> string con prefijo: "u:<id>" (tabla users) o "r:<id>" (tabla registro)
    name -> nombre para mostrar
    username -> username o correo
    role -> rol (administrador/cliente/desarrollador)
    """
    def __init__(self, uid, name, username, role):
        self.id = uid
        self.name = name
        self.username = username
        self.role = role

    # UserMixin ya provee is_authenticated, etc.

@login_manager.user_loader
def load_user(user_id):
    """
    user_id es la cadena que guardamos con login_user (ej. "u:1" o "r:42").
    Devolver User() si existe, si no -> None
    """
    if not user_id:
        return None
    try:
        prefix, num = user_id.split(":", 1)
    except ValueError:
        return None

    if prefix == "u":  # tabla users
        row = q("SELECT id, username, rol FROM users WHERE id=?", (num,), one=True)
        if row:
            uid, username, role = row
            return User(f"u:{uid}", username, username, role)
    elif prefix == "r":  # tabla registro
        row = q("SELECT id, nombre, apellido, correo, rol FROM registro WHERE id=?", (num,), one=True)
        if row:
            uid, nombre, apellido, correo, role = row
            nombre_completo = f"{nombre} {apellido}"
            return User(f"r:{uid}", nombre_completo, correo, role)
    return None

# ----------------------------
# Helpers
# ----------------------------
def q(sql, params=(), one=False):
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute(sql, params)
    data = cur.fetchone() if one else cur.fetchall()
    con.commit()
    con.close()
    return data

def hash_password(password):
    """Genera un hash seguro con bcrypt"""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def check_password(password, hashed):
    """Verifica si una contraseña coincide con su hash"""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def is_bcrypt_hash(s):
    """Detecta si un string ya es un hash bcrypt válido"""
    return isinstance(s, str) and (s.startswith("$2a$") or s.startswith("$2b$") or s.startswith("$2y$"))

def migrate_passwords():
    """Convierte contraseñas en texto plano en la tabla registro y users a bcrypt"""
    registros = q("SELECT id, password FROM registro")
    for uid, pwd in registros:
        if pwd and not is_bcrypt_hash(pwd):
            hashed = hash_password(pwd)
            q("UPDATE registro SET password=? WHERE id=?", (hashed, uid))

    users = q("SELECT id, password FROM users")
    for uid, pwd in users:
        if pwd and not is_bcrypt_hash(pwd):
            hashed = hash_password(pwd)
            q("UPDATE users SET password=? WHERE id=?", (hashed, uid))

def ensure_tables():
    # crea tablas si no existen
    q("""CREATE TABLE IF NOT EXISTS users(
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           username TEXT UNIQUE NOT NULL,
           password TEXT NOT NULL,
           rol TEXT NOT NULL
         )""")
    q("""CREATE TABLE IF NOT EXISTS registro(
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           nombre TEXT NOT NULL,
           apellido TEXT NOT NULL,
           correo TEXT UNIQUE NOT NULL,
           telefono TEXT,
           rol TEXT CHECK(rol IN ('cliente','desarrollador')) NOT NULL,
           cargo TEXT,
           password TEXT NOT NULL
         )""")
    q("""CREATE TABLE IF NOT EXISTS progreso(
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           usuario_id INTEGER NOT NULL,
           descripcion TEXT NOT NULL,
           avance INTEGER DEFAULT 0,
           fecha TEXT DEFAULT (datetime('now','localtime'))
         )""")

    # tabla para cambios pendientes de contraseña (token)
    q("""CREATE TABLE IF NOT EXISTS cambios_pendientes(
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           correo TEXT NOT NULL,
           nueva_contraseña_hash TEXT NOT NULL,
           token TEXT UNIQUE NOT NULL,
           creado_en TEXT DEFAULT (datetime('now','localtime'))
         )""")

    # admin por defecto (ahora con contraseña encriptada)
    admin = q("SELECT id FROM users WHERE username=?", ("admin",), one=True)
    if not admin:
        hashed_admin_pass = hash_password("admin123")
        q("INSERT INTO users(username,password,rol) VALUES(?,?,?)",
          ("admin", hashed_admin_pass, "administrador"))

    # migrar contraseñas antiguas
    migrate_passwords()

@app.before_request
def _before():
    ensure_tables()

# ----------------------------
# Rutas
@app.route("/")
def home():
    # si ya está logueado, redirigir por rol (opcional)
    if current_user.is_authenticated:
        if current_user.role == "administrador":
            return redirect(url_for("admin"))
        if current_user.role == "cliente":
            return redirect(url_for("cliente"))
        if current_user.role == "desarrollador":
            return redirect(url_for("desarrollador"))
    return render_template("login.html")

# ---------- Login ----------
@app.route("/login", methods=["POST"])
def login():
    usuario = request.form.get("usuario", "").strip()
    password = request.form.get("password", "").strip()

    # 1) ¿Es admin? => tabla users (username)
    row = q("SELECT id, username, password, rol FROM users WHERE username=?", (usuario,), one=True)
    if row:
        uid, uname, hashed, rol = row
        if check_password(password, hashed):
            # crear User y loguear
            user_obj = User(f"u:{uid}", uname, uname, rol)
            login_user(user_obj)
            # también guardo en session para compatibilidad con el resto del código
            session["usuario_id"] = uid
            session["nombre"] = uname
            session["rol"] = rol
            return redirect(url_for("admin"))

    # 2) ¿Cliente o desarrollador? => tabla registro (correo)
    row = q("SELECT id, nombre, apellido, rol, password FROM registro WHERE correo=?", (usuario,), one=True)
    if row:
        uid, nombre, apellido, rol, hashed = row
        if check_password(password, hashed):
            nombre_completo = f"{nombre} {apellido}"
            user_obj = User(f"r:{uid}", nombre_completo, usuario, rol)
            login_user(user_obj)
            session["usuario_id"] = uid
            session["nombre"] = nombre_completo
            session["rol"] = rol
            return redirect(url_for(rol))

    # fallo
    return "Usuario o contraseña incorrectos"

# ---------- Registro ----------
@app.route("/registro", methods=["POST"])
def registro():
    nombre = request.form.get("nombre", "").strip()
    apellido = request.form.get("apellido", "").strip()
    correo = request.form.get("correo", "").strip()
    telefono = request.form.get("telefono", "").strip()
    rol = request.form.get("rol", "").strip()
    cargo = request.form.get("cargo", "").strip() if rol == "desarrollador" else ""
    password = request.form.get("password", "").strip()

    if not (nombre and apellido and correo and rol and password):
        return "Faltan campos obligatorios"

    hashed_pass = hash_password(password)

    try:
        q("INSERT INTO registro(nombre, apellido, correo, telefono, rol, cargo, password) VALUES(?,?,?,?,?,?,?)",
          (nombre, apellido, correo, telefono, rol, cargo, hashed_pass))
    except Exception as e:
        return f"Error al registrar: {e}"

    return redirect(url_for("home"))

# ---------- Lógica para cambiar contraseña ----------
@app.route("/cambiar_contraseña", methods=["GET", "POST"])
def cambiar_contraseña():
    mensaje = None
    exito = False

    if request.method == "POST":
        correo = request.form["correo"]
        nueva_contraseña = request.form["nueva_contraseña"]

        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()

        # Verificar si el correo existe en la tabla correcta
        cur.execute("SELECT id FROM registro WHERE correo = ?", (correo,))
        usuario = cur.fetchone()
        con.close()

        if usuario:
            # NO actualizamos aún. Guardamos token y el HASH de la nueva contraseña
            enviar_correo_confirmacion(correo, nueva_contraseña)
            mensaje = "Se ha enviado un enlace a tu correo para confirmar el cambio de contraseña."
            exito = True
        else:
            mensaje = "El correo no está registrado en el sistema."
            exito = False

    return render_template("cambiar_contraseña.html", mensaje=mensaje, exito=exito)

def enviar_correo_confirmacion(destinatario, nueva_contraseña_plain):
    remitente = "proyectcodecraft@gmail.com"
    contraseña = "vtfpwhvpsryjocne"  # tu contraseña de aplicación

    token = secrets.token_urlsafe(32)
    nueva_hash = hash_password(nueva_contraseña_plain)

    # Guardar token y nueva contraseña (HASH) en la tabla temporal
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""
        INSERT INTO cambios_pendientes (correo, nueva_contraseña_hash, token, creado_en)
        VALUES (?, ?, ?, datetime('now'))
    """, (destinatario, nueva_hash, token))
    con.commit()
    con.close()

    enlace_activacion = url_for("activar_contraseña", token=token, _external=True)

    cuerpo = f"""
Hola,

Has solicitado un cambio de contraseña en tu cuenta de Code_Craft.
Para confirmar y activar tu nueva contraseña, haz clic en el siguiente enlace:

{enlace_activacion}

Si no solicitaste este cambio, ignora este mensaje.
"""

    mensaje = MIMEMultipart()
    mensaje["From"] = remitente
    mensaje["To"] = destinatario
    mensaje["Subject"] = "Confirmación de Cambio de Contraseña"
    mensaje.attach(MIMEText(cuerpo, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as servidor:
            servidor.starttls()
            servidor.login(remitente, contraseña)
            servidor.sendmail(remitente, destinatario, mensaje.as_string())
    except Exception as e:
        print(f"Error enviando correo: {e}")

# ---------- Activar nueva contraseña ----------
@app.route("/activar_contraseña")
def activar_contraseña():
    token = request.args.get("token")
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""
        SELECT correo, nueva_contraseña_hash FROM cambios_pendientes
        WHERE token = ? AND datetime(creado_en) >= datetime('now', '-15 minutes')
    """, (token,))
    registro = cur.fetchone()

    if registro:
        correo, nueva_contraseña_hash = registro
        # Actualizamos la contraseña (HASH) en la tabla registro
        cur.execute("UPDATE registro SET password = ? WHERE correo = ?", (nueva_contraseña_hash, correo))
        cur.execute("DELETE FROM cambios_pendientes WHERE token = ?", (token,))
        con.commit()
        con.close()
        return "✅ Tu contraseña ha sido activada correctamente."
    else:
        con.close()
        return "❌ El enlace es inválido o ha expirado."

# ---------- Logout ----------
@app.route("/logout")
def logout():
    logout_user()
    session.clear()
    return redirect(url_for("home"))

# ---------- Cliente ----------
@app.route("/cliente")
@login_required
def cliente():
    # Verificamos que el usuario tenga rol "cliente"
    if not getattr(current_user, "role", None) or current_user.role != "cliente":
        return redirect(url_for("home"))

    # Si user id es del tipo r:<id> obtenemos el número
    try:
        _, uid_str = current_user.get_id().split(":", 1)
        uid = int(uid_str)
    except Exception:
        return redirect(url_for("home"))

    progresos = q("""
        SELECT descripcion, avance, fecha 
        FROM progreso 
        WHERE usuario_id=? 
        ORDER BY id DESC
    """, (uid,))

    conteo_clientes = q("SELECT COUNT(*) FROM registro WHERE rol='cliente'", one=True)[0]
    conteo_devs = q("SELECT COUNT(*) FROM registro WHERE rol='desarrollador'", one=True)[0]

    # Renderizar template Argon para cliente (usa current_user disponible en templates)
    return render_template(
        "clientes_admin/index.html",
        usuario=current_user.name,
        datos=progresos,
        conteo_clientes=conteo_clientes,
        conteo_devs=conteo_devs
    )

# ---------- Desarrollador ----------
@app.route("/desarrollador")
@login_required
def desarrollador():
    if not getattr(current_user, "role", None) or current_user.role != "desarrollador":
        return redirect(url_for("home"))
    try:
        _, uid_str = current_user.get_id().split(":", 1)
        uid = int(uid_str)
    except Exception:
        return redirect(url_for("home"))

    progresos = q("SELECT descripcion, avance, fecha FROM progreso WHERE usuario_id=? ORDER BY id DESC", (uid,))
    cargo_row = q("SELECT cargo FROM registro WHERE id=?", (uid,), one=True)
    cargo = cargo_row[0] if cargo_row else ""
    return render_template("desarrollador.html", usuario=current_user.name, cargo=cargo, progresos=progresos)

# ---------- Agregar progreso ----------
@app.route("/progreso/agregar", methods=["POST"])
@login_required
def progreso_agregar():
    # Solo usuarios logueados (cliente/desarrollador)
    try:
        prefix, uid_str = current_user.get_id().split(":", 1)
        uid = int(uid_str)
    except Exception:
        return redirect(url_for("home"))

    desc = request.form.get("descripcion", "").strip()
    try:
        avance = int(request.form.get("avance", "0"))
    except:
        avance = 0
    avance = max(0, min(100, avance))
    if desc:
        q("INSERT INTO progreso(usuario_id, descripcion, avance) VALUES(?,?,?)", (uid, desc, avance))
    # redirigir a su rol (cliente/desarrollador)
    return redirect(url_for(current_user.role))

# ---------- Admin ----------
@app.route("/admin")
@login_required
def admin():
    if not getattr(current_user, "role", None) or current_user.role != "administrador":
        return redirect(url_for("home"))

    datos = q("""
      SELECT r.nombre || ' ' || r.apellido AS usuario,
             r.rol,
             p.descripcion,
             p.avance,
             p.fecha
      FROM progreso p
      JOIN registro r ON r.id = p.usuario_id
      ORDER BY p.id DESC
    """)

    conteo_clientes = q("SELECT COUNT(*) FROM registro WHERE rol='cliente'", one=True)[0]
    conteo_devs = q("SELECT COUNT(*) FROM registro WHERE rol='desarrollador'", one=True)[0]

    return render_template(
        "admin.html",
        usuario=current_user.name,
        datos=datos,
        conteo_clientes=conteo_clientes,
        conteo_devs=conteo_devs
    )

# ---------- Control desarrolladores ----------
@app.route("/control_desarrolladores")
@login_required
def vista_desarrolladores():
    if not getattr(current_user, "role", None) or current_user.role != "administrador":
        return redirect(url_for("home"))

    desarrolladores = q("""
        SELECT r.id,
               r.nombre || ' ' || r.apellido AS nombre,
               COALESCE(AVG(p.avance),0) AS avance_promedio
        FROM registro r
        LEFT JOIN progreso p ON r.id = p.usuario_id
        WHERE r.rol='desarrollador'
        GROUP BY r.id
    """)

    return render_template("control_desarrolladores.html", usuario=current_user.name, desarrolladores=desarrolladores)

# ---------- Control usuarios ----------
@app.route("/control_usuarios")
@login_required
def vista_usuarios():
    if not getattr(current_user, "role", None) or current_user.role != "administrador":
        return redirect(url_for("home"))
    return render_template("control_usuarios.html", usuario=current_user.name)

if __name__ == "__main__":
    app.run(debug=True)
