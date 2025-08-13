from flask import Flask, render_template, request, redirect
import sqlite3
import os

app = Flask(__name__)

# Ruta absoluta a la base de datos
DATABASE = os.path.join(os.path.dirname(__file__), 'databases', 'db_Proyecto.db')

# Función para guardar datos
def guardar_en_bd(nombre, correo, telefono, contrasena):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO clientes (nombre, correo, telefono, contrasena)
        VALUES (?, ?, ?, ?)
    ''', (nombre, correo, telefono, contrasena))
    conn.commit()
    conn.close()

# Ruta para mostrar y procesar el formulario
@app.route('/', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        nombre = request.form['nombre']
        correo = request.form['correo']
        telefono = request.form['telefono']
        contrasena = request.form['contrasena']
        guardar_en_bd(nombre, correo, telefono, contrasena)
        return '<h2>✅ Registro exitoso</h2>'
    return render_template('registro.html')

if __name__ == '__main__':
    app.run(debug=True)
