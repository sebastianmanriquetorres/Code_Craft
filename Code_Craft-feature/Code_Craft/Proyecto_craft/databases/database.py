import sqlite3

def conectar_base_datos():
    try:
        conn = sqlite3.connect("db_Proyecto.db")
        print("✅ Conexión a la base de datos exitosa. ¡Bien hecho 🧠🚀")
        return conn
    except sqlite3.Error as e:
        print(f"❌ Error al conectar a la base de datos: {e}")

# Ejecutar solo si este archivo es el principal
if __name__ == "__main__":
    conectar_base_datos()
