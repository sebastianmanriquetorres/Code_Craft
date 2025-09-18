from flask import Flask, request, redirect, url_for, render_template, session
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
    """Convierte contraseñas en texto plano en la tabla registro a bcrypt"""
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
# ----------------------------
@app.route("/")
def home():
    return render_template("login.html")

# ---------- Login ----------
@app.route("/login", methods=["POST"])
def login():
    usuario = request.form.get("usuario", "").strip()
    password = request.form.get("password", "").strip()

    # 1) ¿Es admin?
    row = q("SELECT id, username, password, rol FROM users WHERE username=?", (usuario,), one=True)
    if row:
        uid, uname, hashed, rol = row
        if check_password(password, hashed):
            session.clear()
            session["usuario_id"] = uid
            session["nombre"] = uname
            session["rol"] = rol
            return redirect(url_for("admin"))

    # 2) ¿Cliente o desarrollador?
    row = q("SELECT id, nombre, apellido, rol, password FROM registro WHERE correo=?", (usuario,), one=True)
    if row:
        uid, nombre, apellido, rol, hashed = row
        if check_password(password, hashed):
            session.clear()
            session["usuario_id"] = uid
            session["nombre"] = f"{nombre} {apellido}"
            session["rol"] = rol
            return redirect(url_for(rol))

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

        if usuario:
            # YA NO ACTUALIZAMOS AQUÍ LA CONTRASEÑA ❌
            # Solo enviamos correo con token de confirmación
            con.close()

            enviar_correo_confirmacion(correo, nueva_contraseña)
            mensaje = "Se ha enviado un enlace a tu correo para confirmar el cambio de contraseña."
            exito = True
        else:
            mensaje = "El correo no está registrado en el sistema."
            exito = False

    return render_template("cambiar_contraseña.html", mensaje=mensaje, exito=exito)


def enviar_correo_confirmacion(destinatario, nueva_contraseña):
    remitente = "proyectcodecraft@gmail.com"
    contraseña = "vtfpwhvpsryjocne"


    token = secrets.token_urlsafe(32)

    # Guardar token y nueva contraseña en la tabla temporal
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""
        INSERT INTO cambios_pendientes (correo, nueva_contraseña, token, creado_en)
        VALUES (?, ?, ?, datetime('now'))
    """, (destinatario, nueva_contraseña, token))
    con.commit()
    con.close()

    enlace_activacion = url_for("activar_contraseña", token=token, _external=True)

    cuerpo = f"""
    Hola,

    Has solicitado un cambio de contraseña.
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
        SELECT correo, nueva_contraseña FROM cambios_pendientes
        WHERE token = ? AND datetime(creado_en) >= datetime('now', '-15 minutes')
    """, (token,))
    registro = cur.fetchone()

    if registro:
        correo, nueva_contraseña = registro
        # Ahora sí actualizamos la contraseña en la tabla correcta
        cur.execute("UPDATE registro SET password = ? WHERE correo = ?", (nueva_contraseña, correo))
        cur.execute("DELETE FROM cambios_pendientes WHERE token = ?", (token,))
        con.commit()
        con.close()
        return "✅ Tu contraseña ha sido activada correctamente."
    else:
        return "❌ El enlace es inválido o ha expirado."

# ---------- Logout ----------
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))

# ---------- Cliente ----------
@app.route("/cliente")
def cliente():
    if "rol" not in session or session["rol"] != "cliente":
        return redirect(url_for("home"))
    uid = session["usuario_id"]
    progresos = q("SELECT descripcion, avance, fecha FROM progreso WHERE usuario_id=? ORDER BY id DESC", (uid,))
    return render_template("cliente.html", usuario=session["nombre"], progresos=progresos)

# ---------- Desarrollador ----------
@app.route("/desarrollador")
def desarrollador():
    if "rol" not in session or session["rol"] != "desarrollador":
        return redirect(url_for("home"))
    uid = session["usuario_id"]
    progresos = q("SELECT descripcion, avance, fecha FROM progreso WHERE usuario_id=? ORDER BY id DESC", (uid,))
    cargo_row = q("SELECT cargo FROM registro WHERE id=?", (uid,), one=True)
    cargo = cargo_row[0] if cargo_row else ""
    return render_template("desarrollador.html", usuario=session["nombre"], cargo=cargo, progresos=progresos)

# ---------- Agregar progreso ----------
@app.route("/progreso/agregar", methods=["POST"])
def progreso_agregar():
    if "usuario_id" not in session or session["usuario_id"] is None:
        return redirect(url_for("home"))
    uid = session["usuario_id"]
    desc = request.form.get("descripcion", "").strip()
    try:
        avance = int(request.form.get("avance", "0"))
    except:
        avance = 0
    avance = max(0, min(100, avance))
    if desc:
        q("INSERT INTO progreso(usuario_id, descripcion, avance) VALUES(?,?,?)", (uid, desc, avance))
    return redirect(url_for(session["rol"]))

# ---------- Admin ----------
@app.route("/admin")
def admin():
    if "rol" not in session or session["rol"] != "administrador":
        return redirect(url_for("home"))

    # datos de progreso
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

    # conteos para gráficas
    conteo_clientes = q("SELECT COUNT(*) FROM registro WHERE rol='cliente'", one=True)[0]
    conteo_devs = q("SELECT COUNT(*) FROM registro WHERE rol='desarrollador'", one=True)[0]

    return render_template(
        "admin.html",
        usuario=session["nombre"],
        datos=datos,
        conteo_clientes=conteo_clientes,
        conteo_devs=conteo_devs
    )

# ---------- Control desarrolladores ----------
@app.route("/control_desarrolladores")
def vista_desarrolladores():
    if "rol" not in session or session["rol"] != "administrador":
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

    return render_template("control_desarrolladores.html", usuario=session["nombre"], desarrolladores=desarrolladores)

# ---------- Control usuarios ----------
@app.route("/control_usuarios")
def vista_usuarios():
    return render_template("control_usuarios.html")

if __name__ == "__main__":
    app.run(debug=True)
