# Configuration file for the Sphinx documentation builder.
# Documentation: https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
project = 'Code Craft'
copyright = '2025, Code Craft'
author = 'Equipo Code Craft'
release = '2.0.1'

# -- General configuration ---------------------------------------------------
extensions = [
    "myst_parser",  # Permite usar archivos Markdown (.md)
]

# Soporte para Markdown y RST
source_suffix = {
    '.rst': 'restructuredtext',
    '.md': 'markdown',
}

templates_path = ['_templates']
exclude_patterns = []

language = 'es'

# -- Options for HTML output -------------------------------------------------
html_theme = 'furo'  # Tema moderno
html_static_path = ['_static']

# -- Personalización opcional ------------------------------------------------
# Puedes agregar un CSS personalizado (por ejemplo, _static/custom.css)
html_css_files = [
    'custom.css',
]

# -- Configuración de MyST (Markdown) ----------------------------------------
myst_enable_extensions = [
    "deflist",
    "colon_fence",
    "html_admonition",
    "html_image",
]
