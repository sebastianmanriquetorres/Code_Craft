from flask import Flask, render_template, request, redirect
import sqlite3

app = Flask(__name__)

# Crear base de datos y tabla si no existe
def init_db():
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


@app.route("/", methods=["GET", "POST"])
def registro():
    if request.method == "POST":
        # Recibir datos del formulario
        datos = (
            request.form["nombre_empresa"],
            request.form["nombre"],
            request.form["correo"],
            request.form["Telefono"],
            request.form["direccion"],
            request.form["contrasena"]
        )

        # Guardar en la base de datos
        with sqlite3.connect("database/usuarios.db") as conn:
            conn.execute("""
                INSERT INTO clientes_registro (
                    nombre_empresa, nombre, correo, telefono, direccion, contrasena
                ) VALUES (?, ?, ?, ?, ?, ?)""", datos)

        return redirect("/success")  # Redirige después del registro

    return render_template("registro.html")

@app.route("/success")
def success():
    return "¡Registro exitoso!"

if __name__ == "__main__":
    init_db()
    app.run(debug=True)
