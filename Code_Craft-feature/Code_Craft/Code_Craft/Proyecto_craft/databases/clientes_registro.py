import sqlite3
import pprint
from tabulate import tabulate

# Función para conectar con la base de datos
def get_db_connection():
    try:
        conn = sqlite3.connect('db_Proyecto.db')  # Ruta relativa
        conn.row_factory = sqlite3.Row
        print("✅ Conexión a la base de datos exitosa.")
        return conn
    except sqlite3.Error as e:
        print("❌ Error al conectar con la base de datos:", e)
        return None

# Función para obtener todos los usuarios
def obtener_usuarios():
    conn = get_db_connection()
    if conn is None:
        return []
    
    try:
        clientes = conn.execute('SELECT * FROM clientes_registro').fetchall()
        return clientes
    except sqlite3.Error as e:
        print("❌ Error al ejecutar la consulta:", e)
        return []
    finally:
        conn.close()

# Al final del script
if __name__ == '__main__':
    lista_usuarios = obtener_usuarios()
    if lista_usuarios:
        tabla = [dict(usuario) for usuario in lista_usuarios]
        print(tabulate(tabla, headers="keys", tablefmt="fancy_grid"))
    else:
        print("⚠️ No se encontraron registros.")
