#  3. Instalación y Configuración del Proyecto

En este documento se detalla el proceso completo de instalación y ejecución del proyecto **Code Craft**, incluyendo la documentación técnica generada con **Sphinx (Markdown)** y el entorno de desarrollo del **Frontend con Node.js y React**.

---

##  1. Instalación y Ejecución de la Documentación (Sphinx + Markdown)

###  Requisitos previos
Antes de comenzar, asegúrate de tener instalados los siguientes componentes:

| Herramienta | Versión Recomendada | Descripción |
|--------------|---------------------|--------------|
| Python       | 3.8 o superior       | Requerido para ejecutar Sphinx |
| pip          | Última versión       | Administrador de paquetes de Python |
| Sphinx       | 7.0 o superior       | Generador de documentación |
| myst-parser  | Última versión       | Permite usar Markdown (.md) en Sphinx |

---

###  Instalación de Python y pip

 - **Windows (CMD o PowerShell)**
1. Descargar Python desde [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. Durante la instalación, **activar la casilla**:  
    *"Add Python to PATH"*
3. Verificar instalación:
   ```bash
   python --version
   pip --version
   ```


### macOS / Linux (Terminal)
   ```bash
 sudo apt install python3 python3-pip -y de (Ubuntu / Debian)
 o
 brew install python de (macOS con Homebrew)
 ```

 ```bash
 python3 --version
 pip3 --version
 ```





### Creación y Activación del Entorno Virtual

Para mantener las dependencias del proyecto aisladas, crea un entorno virtual:
- **Windows (CMD o PowerShell):**
```bash
 cd Code_Craft
 python -m venv venv
 venv\Scripts\activate
 ```

- **macOS / Linux:**
 ```bash
 cd Code_Craft
 python3 -m venv venv
 source venv/bin/activate
 ```

- **Una vez activado, deberías ver algo como:**
 ```bash
 (venv) C:\Users\usuario\Code_Craft>
 ```

- **Nota: Para salir del entorno virtual, ejecuta:**
 ```bash
 deactivate
 ```

 ##  Instalación de Sphinx y MYST Parser

- **Con el entorno virtual activo, instala las dependencias necesarias:**
 ```bash
 pip install sphinx myst-parser sphinx_rtd_theme
 ```

- **Puedes guardar estas dependencias en un archivo para uso futuro:**
 ```bash
 pip freeze > requirements.txt
 ```

##  Creación del entorno de documentación

- **Desde la carpeta raíz del proyecto:**
 ```bash
 sphinx-quickstart docs
 ```
 ---

- **Durante la configuración, selecciona:**

 Project name → Code_Craft

 Author name → Equipo Code_Craft

 Separate source and build dirs → y

 Enable autodoc → y

 Enable markdown → n (lo agregaremos manualmente)

---

- **Configurar soporte para Markdown:**
Abre el archivo docs/source/conf.py y agrega:
```bash
 # -- Project information -----------------------------------------------------
 project = 'Code Craft'
 author = 'Equipo Code Craft'
 release = '1.0'

 # -- General configuration ---------------------------------------------------
 extensions = [
    'myst_parser'
 ]

 source_suffix = {
    '.rst': 'restructuredtext',
    '.md': 'markdown',
 }

 html_theme = 'sphinx_rtd_theme'

 # -- Path setup --------------------------------------------------------------
 import os
 import sys
 sys.path.insert(0, os.path.abspath('../..'))
 ```

- **Enlazar los archivos Markdown en la documentación:**
Edita docs/source/index.md y agrega:
 ```bash
 #  Documentación del Proyecto Code Craft

 Bienvenido a la documentación oficial del proyecto **Code_Craft**.

 ```{toctree}
 :maxdepth: 2
 :caption: Contenido

 1_introduccion.md
 2_arquitectura_sistema.md
 3_instalacion_configuracion.md
 4_manual_usuario.md


 ###  Compilar y ejecutar la documentación

 Para generar la documentación en formato HTML:

 ```bash
 # Desde la raíz del proyecto
 cd docs
 make html


 ```

- **Luego abre el archivo generado:**
```bash
 _build/html/index.html
```

- **En Windows (PowerShell)**
```bash
 start _build/html/index.html
```

- **En macOS / Linux**
```bash
 open _build/html/index.html
```

---

##  2. Instalación y Ejecución del Proyecto (Frontend con npm)
El proyecto Code_Craft fue desarrollado con React.js, por lo que requiere Node.js y npm.

### Requisitos previos

| Herramienta | Versión Recomendada | Descripción                           |
| ----------- | ------------------- | ------------------------------------- |
| Node.js     | 18 o superior       | Entorno de ejecución de JavaScript    |
| npm         | Última versión      | Administrador de dependencias de Node |

---

### Instalación de Node.js y npm
- **Windows**
 1. Descargar el instalador desde https://nodejs.org/[https://nodejs.org/](https://nodejs.org/)
 2. Instalar y verificar:
```bash
 node -v
 npm -v
```

- **macOS / Linux**
```bash

 sudo apt install nodejs npm -y  de ( Ubuntu / Debian)
  o
 brew install node  de ( macOS con Homebrew)

 node -v
 npm -v
```

- **Instalación de dependencias del proyecto**
 Ubícate en la carpeta principal del frontend ejemplo:
```bash
 cd codecraft-frontend
 npm install
```

Esto descargará todas las dependencias definidas en package.json.

- **Ejecución del entorno de desarrollo**
Para iniciar el servidor local:
```bash
 npm run dev
```

Salida esperada
```bash
 VITE v5.0.0  ready in 500ms
 Local: http://localhost:5173/
```
Abre esa URL en tu navegador.

- **Consejos adicionales**
Si npm install genera errores:
```bash
 npm cache clean --force
```
- **Si el puerto 5173 está ocupado, cámbialo en vite.config.js.**

- **Si aparece npm ERR! missing script: dev, revisa que tu package.json tenga:**
```bash
 "scripts": {
  "dev": "vite"
 }
```

---
## Errores comunes y soluciones

| Error                              | Causa                      | Solución                                  |
| ---------------------------------- | -------------------------- | ----------------------------------------- |
| `ModuleNotFoundError` en Sphinx    | Faltan dependencias        | Ejecuta `pip install -r requirements.txt` |
| `npm ERR! missing script: dev`     | Script no definido         | Agrega `"dev": "vite"`                    |
| `pip: command not found`           | Python no agregado al PATH | Reinstala Python con "Add Python to PATH" |
| `Permission denied` en macOS/Linux | Falta de permisos          | Usa `sudo`                                |
| `Port already in use 5173`         | Otro proceso usa el puerto | Cambia el puerto o detén el proceso       |

---

---
## Verificación Final

| Elemento       | Comando                                 | Resultado Esperado              |
| -------------- | --------------------------------------- | ------------------------------- |
| Documentación  | `make html`                             | Carpeta `_build/html` generada  |
| Sitio local    | `npm run dev`                           | Proyecto accesible en navegador |
| Entorno Python | `venv` activado                         | Dependencias aisladas           |
| Versiones      | `python --version`, `node -v`, `npm -v` | Versiones correctas             |

---

## Resultado final

- La documentación con Sphinx + Markdown se genera correctamente en HTML.

- El entorno virtual asegura independencia y limpieza del entorno.

- El proyecto Code Craft se ejecuta correctamente con npm run dev.

- Compatible con Windows, macOS y Linux.

- Listo para presentación ante instructores o evaluación técnica.


**Autor: Equipo de Desarrollo – Code_Craft**
Versión del Documento: 2.0.1
Última actualización: Noviembre 2025