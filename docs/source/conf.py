# -- Configuración básica del proyecto -------------------------------------

project = 'Documentación de Code_Craft'
copyright = '2025, Code_Craft Team'
author = 'Equipo Code_Craft'
release = '2.0.0'

# -- Extensiones -----------------------------------------------------------
extensions = [
    'myst_parser',
]

# -- Archivos de entrada ---------------------------------------------------
source_suffix = {
    '.rst': 'restructuredtext',
    '.md': 'markdown',
}

# -- Configuración del tema ------------------------------------------------
html_theme = 'furo'
html_static_path = ['_static']
html_logo = '_images/Code_Craft_Img.jpg'  # opcional, si luego agregas un logo
html_title = "Documentación de Code_Craft"

# -- Idioma ---------------------------------------------------------------
language = 'es'
