import sqlite3

# Conectar a la base de datos existente
conn = sqlite3.connect("DB/usuario.db")
cursor = conn.cursor()

# Mostrar todas las tablas
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tablas = cursor.fetchall()
print("Tablas encontradas:", tablas)

# Mostrar todos los registros de la tabla users
cursor.execute("SELECT * FROM users;")
usuarios = cursor.fetchall()
print("Usuarios registrados:")
for usuario in usuarios:
    print(usuario)

conn.close()
