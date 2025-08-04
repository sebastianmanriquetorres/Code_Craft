from app import app
from flask import render_template

@app.route('/')
def index():
    """
    Ruta principal del proyecto Code_Craft.
    """
    return render_template('index.html')
