from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)

# Ruta absoluta a la base de datos
DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'databases', 'db_Proyecto.db')

# Función para guardar datos en la base de datos
def guardar_cliente(data):
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO clientes_registro (
            nombre_empresa, nombre, correo, Telefono, direccion, password
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['nombre_empresa'],
        data['nombre'],
        data['correo'],
        data['Telefono'],
        data['direccion'],
        data['fecha_registro'],
        data['contrasena']
    ))
    conn.commit()
    conn.close()

# Redirigir desde la raíz hacia el formulario de registro
@app.route('/')
def inicio():
    return redirect(url_for('registro'))

# Ruta para mostrar el formulario y guardar datos
@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if request.method == 'POST':
        datos = {
            'nombre_empresa': request.form['nombre_empresa'],
            'nombre': request.form['nombre'],
            'correo': request.form['correo'],
            'Telefono': request.form['Telefono'],
            'direccion': request.form['direccion'],
            'fecha_registro': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'contrasena': request.form['contrasena']
        }
        guardar_cliente(datos)
        return redirect(url_for('registro_exitoso'))

    return render_template('registro.html')

# Ruta de confirmación
@app.route('/registro_exitoso')
def registro_exitoso():
    return '<h2>🎉 Registro exitoso. ¡Gracias por unirte a Code_Craft!</h2>'

if __name__ == '__main__':
    app.run(debug=True)
