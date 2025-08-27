from flask import Flask, request, redirect, url_for, render_template, session
import sqlite3
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

    # admin por defecto
    admin = q("SELECT id FROM users WHERE username=?", ("admin",), one=True)
    if not admin:
        q("INSERT INTO users(username,password,rol) VALUES(?,?,?)",
          ("admin","admin123","administrador"))

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
    row = q("SELECT id, username, rol FROM users WHERE username=? AND password=?",
            (usuario, password), one=True)
    if row:
        _, uname, rol = row
        session.clear()
        session["usuario_id"] = None
        session["nombre"] = uname
        session["rol"] = rol
        return redirect(url_for("admin"))

    # 2) ¿Cliente o desarrollador?
    row = q("""SELECT id, nombre, apellido, rol
               FROM registro
               WHERE correo=? AND password=?""", (usuario, password), one=True)
    if row:
        uid, nombre, apellido, rol = row
        session.clear()
        session["usuario_id"] = uid
        session["nombre"] = f"{nombre} {apellido}"
        session["rol"] = rol
        return redirect(url_for(rol))  # redirige a cliente o desarrollador

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

    try:
        q("INSERT INTO registro(nombre, apellido, correo, telefono, rol, cargo, password) VALUES(?,?,?,?,?,?,?)",
          (nombre, apellido, correo, telefono, rol, cargo, password))
    except Exception as e:
        return f"Error al registrar: {e}"

    return redirect(url_for("home"))

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
    return render_template("admin.html", usuario=session["nombre"], datos=datos)

if __name__ == "__main__":
    app.run(debug=True)
