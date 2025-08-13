import sqlite3
from tabulate import tabulate  # Asegúrate de instalarlo con: pip install tabulate

# Conectar a la base de datos
conn = sqlite3.connect('db_Proyecto.db')
cursor = conn.cursor()

try:
    # Consultar datos
    cursor.execute("SELECT * FROM clientes_registro")
    resultados = cursor.fetchall()

    # Definir encabezados
    encabezados = ["ID", "Nombre de la Empresa", "Correo", "Teléfono", "Dirección", "Fecha de Registro", "Password"]

    # Mostrar tabla con tabulate
    print(tabulate(resultados, headers=encabezados, tablefmt="fancy_grid"))

    print("\n📌 Desarrollado por David Santiago Baquero Villarraga")

except sqlite3.Error as e:
    print("❌ Error al insertar el registro:", e)
finally:
    cursor.close()
    conn.close()
