# 7. Pruebas de Calidad

El proceso de aseguramiento de la calidad (QA) en el proyecto Code_Craft tiene como objetivo garantizar que el sistema cumpla con los requerimientos funcionales, de rendimiento y usabilidad definidos en las etapas de diseño y desarrollo.

El equipo QA, liderado por Sebastián Manrique, realizó diferentes pruebas funcionales, de interfaz, compatibilidad y rendimiento, documentando los resultados y acciones correctivas necesarias.

---

## 1. Objetivo de las pruebas

Comprobar que las funcionalidades del sistema Code_Craft operen correctamente, asegurando una experiencia fluida y sin errores tanto para administradores, desarrolladores y clientes.

---

## 2. Tipos de Pruebas Realizadas

| Tipo de Prueba                  | Descripción                                                                                                          | Estado         | Resultado                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------ |
| **Pruebas Funcionales**         | Validar el correcto funcionamiento de cada módulo (login, registro, creación de proyectos, avances, feedback, etc.). |  Completadas | Sin errores críticos                       |
| **Pruebas de Interfaz (UI/UX)** | Evaluar la usabilidad, coherencia visual, accesibilidad y navegación.                                                |  Completadas | Interfaz intuitiva y responsiva            |
| **Pruebas de Integración**      | Comprobación del flujo entre frontend, backend y base de datos.                                                      |  Completadas | Comunicación estable entre servicios       |
| **Pruebas de Seguridad**        | Validación de credenciales, cifrado de contraseñas y manejo de sesiones.                                             |  Completadas | Cumple los estándares básicos de seguridad |
| **Pruebas de Rendimiento**      | Verificar los tiempos de carga, respuesta de API y optimización de consultas.                                        |  En proceso  | Requiere ajustes menores                   |
| **Pruebas de Compatibilidad**   | Comprobación del sistema en diferentes navegadores y tamaños de pantalla.                                            | Completadas | Compatible con Chrome, Edge y Firefox      |

---

## 3. Escenarios de Prueba

**Inicio de Sesión**

- Objetivo: Validar el acceso mediante correo y contraseña.

Criterios:

- Mostrar mensaje de error si las credenciales son incorrectas.

- Redirigir correctamente al panel principal.



Resultado:  Correcto – El sistema valida y redirige correctamente.

---

**Registro de Usuario**

- Objetivo: Comprobar el registro de clientes y desarrolladores.

Criterios:

- Validar campos obligatorios.

- Mostrar mensaje de confirmación.



Resultado:  Correcto – Los usuarios se registran con éxito.

---


**Creación de Proyecto**

- Objetivo: Verificar que el cliente pueda crear proyectos desde el panel.

Criterios:

- Asociar cliente, desarrollador y plantilla.

- Guardar datos en la base de datos.



Resultado:  Correcto – Se crean y almacenan correctamente los proyectos.


---


**Actualización de Avances**

- Objetivo: Validar que el desarrollador actualice el porcentaje de progreso.

Criterios:

- Registrar fecha y descripción.

- Actualizar correctamente el porcentaje.



Resultado:  Correcto – Se registran avances y se reflejan en tiempo real.

---


**Feedback del Cliente**

- Objetivo: Verificar que los clientes puedan calificar los proyectos.

Criterios:

- Registrar calificación y comentario.

- Mostrar el promedio general.



Resultado:  Correcto – Las valoraciones se registran correctamente.

---

## 4. Resultados Generales

| Categoría   | Total Pruebas | Exitosas | Fallidas | Por Mejorar |
| ----------- | ------------- | -------- | -------- | ----------- |
| Funcionales | 15            | 14       | 0        | 1           |
| Interfaz    | 8             | 8        | 0        | 0           |
| Seguridad   | 5             | 5        | 0        | 0           |
| Rendimiento | 4             | 3        | 0        | 1           |


Conclusión:
El sistema Code_Craft cumple con los estándares de calidad definidos. Solo se requiere optimizar tiempos de respuesta en ciertas consultas de proyectos (mejorando índices o caché en PostgreSQL).

---

## 5. Recomendaciones

Implementar pruebas automáticas con Jest o Cypress para el frontend.

Usar Postman para pruebas de API en entornos de staging.

Integrar GitHub Actions para ejecutar pruebas automáticas en cada push.

Documentar los resultados de pruebas en reportes .html dentro del repositorio.
