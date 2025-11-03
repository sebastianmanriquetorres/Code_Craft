# 9. Anexos

Los anexos recopilan información complementaria al desarrollo del sistema Code_Craft, incluyendo evidencias, configuraciones, diagramas y recursos utilizados durante el ciclo de vida del proyecto.

---

## A. Herramientas Utilizadas

| Tipo                      | Herramienta              | Descripción                                                                |
| ------------------------- | ------------------------ | -------------------------------------------------------------------------- |
| **Frontend**              | React.js                 | Biblioteca de JavaScript para el desarrollo de interfaces dinámicas.       |
| **Backend**               | Node.js + Express.js     | Plataforma y framework usados para la lógica del negocio y servicios REST. |
| **Base de Datos**         | PostgreSQL               | Sistema de gestión de bases de datos relacional.                           |
| **Control de Versiones**  | Git / GitHub             | Control de versiones, colaboración y despliegue del código.                |
| **Diseño UX/UI**          | Figma / Canva            | Creación de interfaces, prototipos y diseño visual del sistema.            |
| **Documentación Técnica** | Sphinx + Markdown        | Generación de la documentación del proyecto.                               |
| **Gestión del Proyecto**  | Trello / GitHub Projects | Planificación y seguimiento de tareas del equipo.                          |

---

## B. Configuración del Entorno

Para ejecutar el proyecto Code Craft en un entorno local:

- Clonar el repositorio:

```bash
git clone https://github.com/CodeCraft-Team/codecraft.git
```

- Instalar dependencias del frontend:

```bash
cd codecraft-frontend
npm install
```

- Instalar dependencias del backend:

```bash
cd codecraft-backend
npm install
```

- Configurar variables de entorno (.env):

```bash
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/codecraft
PORT=3000
JWT_SECRET=CodeCraft2025
```

- Ejecutar los servidores:

```bash

# Backend
npm run dev

# Frontend
npm run start

```

---

## C. Estructura del Proyecto

```bash
Code_Craft/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   └── app.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── docs/
    ├── source/
    │   ├── _static/
    │   ├── index.md
    │   └── *.md
    └── build/

```

---

## D. Diagramas y Referencias Visuales

- Modelo Relacional

```{image} _static/Modelo_relacional.png
:alt: Modelo Relacional del sistema Code_Craft
:align: center
:width: 90%
```

---


- Diagrama Casos de uso

```{image} _static/Diagrama_casos_de_uso.png
:alt: Diagrama Casos de uso del sistema Code_Craft
:align: center
:width: 90%
```

---

## E. Equipo de Desarrollo

| Nombre                 | Rol                                | Responsabilidad Principal                                                           |
| ---------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| **Sebastián Manrique** | QA / Diseñador UX-UI               | Control de calidad, pruebas, diseño de interfaz y documentación.                    |
| **Steven Traviezo**    | Desarrollador Full Stack / Backend | Implementación del backend, conexión con el frontend y gestión de la base de datos. |
| **Juan Beltrán**       | Frontend Developer                 | Maquetación e integración de componentes visuales.                                  |
| **David Baquero**      | Backend Developer                  | Desarrollo de lógica del servidor, endpoints y mantenimiento del sistema.           |

---

## F. Referencias

- Documentación oficial de React.js

- Framework Express.js

- Guía de diseño Material Design

- Manual de base de datos PostgreSQL

- Documentación técnica de Sphinx