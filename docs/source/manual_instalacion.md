#  Manual de Instalación

Guía paso a paso para instalar **Code Craft** en entorno local.

## Requisitos
- Python 3.10+
- Node.js 18+
- Git

## Instalación
```bash
# Clonar el repositorio
git clone https://github.com/CodeCraft/codecraft.git
cd codecraft

# Crear entorno virtual
python -m venv .venv
.venv\Scripts\activate  # En Windows

# Instalar dependencias
pip install -r requirements.txt
npm install

# Ejecutar el proyecto
npm run dev
