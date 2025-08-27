import sqlite3

# Conectar a la base de datos (se crea si no existe)
conn = sqlite3.connect("DB/usuario.db")
cursor = conn.cursor()

# Crear tabla de usuarios
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT NOT NULL
)
""")

# Crear usuario administrador por defecto
try:
    cursor.execute("INSERT INTO users (username, password, rol) VALUES (?, ?, ?)",
                   ("admin2", "admin1234", "administrador"))
    print("Usuario administrador creado.")
except sqlite3.IntegrityError:
    print("El usuario administrador ya existe.")

# Guardar y cerrar
conn.commit()
conn.close()

import os
print("Base de datos usada:", os.path.abspath("DB/usuario.db"))

