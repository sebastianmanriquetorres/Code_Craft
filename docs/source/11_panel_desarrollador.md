# 11. Panel Desarrollador
Tras iniciar sesión, el Desarrollador accede al dashboard, donde puede visualizar sus proyectos enviados, activos, completados, Reseñas, calendario, plantillas, un icono de luna o sol de tema visual, perfil y salir.

```{image} _static/Panel_Desarrollador.png
:alt: panel cliente en Code_Craft
:align: center
:width: 80%
```
---

## Proyectos enviados, activos y completados

**1.  Proyectos Enviados** (Pendientes de Propuesta)
Representa: Las solicitudes de proyecto que el cliente ha enviado (a través del formulario) y que están pendientes de análisis por parte del desarrollador.

- Estado en el Flujo: Es la etapa inicial donde el desarrollador debe analizar la viabilidad y elaborar la Propuesta de Valor.

- Acciones Clave: El desarrollador debe revisar la descripción, el alcance y el presupuesto para decidir si acepta elaborar la propuesta o si la rechaza por inviabilidad.

- Objetivo: Reducir esta lista lo más rápido posible, transformando los envíos en propuestas activas o rechazándolos si no cumplen con los criterios.

**2.  Proyectos Activos** (En Elaboración)
Representa: Los proyectos donde se ha llegado a un Acuerdo Formal (contrato firmado y/o primer pago/anticipo recibido) y la elaboración ya ha comenzado según el cronograma acordado.

- Estado en el Flujo: La etapa de desarrollo, diseño, programación y pruebas. Corresponde al tiempo que el proyecto ocupa en el calendario.

- Acciones Clave: Seguimiento de los hitos del proyecto, gestión de tareas, comunicación constante con el cliente y reuniones de progreso.

- Objetivo: Llevar estos proyectos a su finalización, cumpliendo con el Alcance Detallado y el plazo estipulado.

**3.  Proyectos Completados** (Entregados y Pagados)
Representa: Los proyectos cuya elaboración ha finalizado, han sido entregados al cliente y se ha recibido el pago final correspondiente (según las condiciones de pago ligadas a la entrega).

- Estado en el Flujo: El cierre oficial del ciclo del proyecto.

- Acciones Clave: Mantenimiento del historial, referencias para futuras propuestas, y gestión de garantías o soporte post-entrega (si aplica).

- Objetivo: Servir como portafolio de trabajo exitoso y como referencia de la capacidad del desarrollador para completar proyectos.

---

## Reseñas

**Reseñas y Calificaciones de Proyectos Completados**
Este panel recopila la retroalimentación directa de los clientes una vez que el proyecto se mueve al estado Completado (Entregado y Pagado). Las reseñas son un indicador público de la calidad del servicio, la profesionalidad y la capacidad del desarrollador para elaborar y entregar proyectos exitosamente.

```{image} _static/Reseñas.png
:alt: Reseñas en Code_Craft
:align: center
:width: 80%
```

**Propósito:**

- Validación de Experiencia: Permite a futuros clientes evaluar la trayectoria y la calidad del trabajo del desarrollador.

- Mejora Continua: Proporciona datos valiosos al desarrollador sobre qué aspectos del proceso (comunicación, cumplimiento de plazos, calidad técnica, etc.) pueden mejorarse.

---
## Calendario

El Calendario de Compromisos es la herramienta principal del desarrollador para visualizar, gestionar y monitorear los plazos críticos de cada proyecto en elaboración. Sirve como una referencia inmediata de la carga de trabajo y el tiempo restante para cumplir con las promesas al cliente.

```{image} _static/Calendario_Desarrollador.png
:alt: Calendario desarrollador en Code_Craft
:align: center
:width: 80%
```

**1.  Fecha de Inicio (Acuerdo con el Cliente)**
¿Qué Representa?: Es el día en que se formalizó el Acuerdo con el Cliente (firma del contrato y/o recepción del anticipo).

- Significado: Marca el inicio oficial de la Elaboración del Proyecto y, por lo tanto, el punto desde el cual comienza a correr el tiempo establecido en el cronograma.

- Visualización en el Calendario: El bloque del proyecto comienza en esta fecha.

**2.  Plazo Máximo de Entrega (Fecha Límite)**
¿Qué Representa?: Es la fecha final establecida en la Propuesta de Valor para la Entrega Completa del Proyecto al cliente, lista para su Verificación y el subsiguiente Pago Final.

- Significado: Es el deadline o fecha límite que el desarrollador está obligado a cumplir. Cumplir con este plazo es una condición fundamental para el éxito y la satisfacción del cliente (y la base de las Reseñas).

- Visualización en el Calendario: El bloque del proyecto finaliza en esta fecha, sirviendo como una alerta visual constante para la gestión del tiempo.

---
## Plantillas

Este panel permite al desarrollador crear y gestionar plantillas estandarizadas que sirven como esqueletos de trabajo, y documentos internos, ahorrando tiempo y asegurando la consistencia en el servicio al cliente.

```{image} _static/Plantilla_Desarrollador.png
:alt: Plantilla desarrollador en Code_Craft
:align: center
:width: 80%
```

---

- Crear plantilla nueva

```{image} _static/Crear_Plantilla.jpg
:alt: Crear plantilla desarrollador en Code_Craft
:align: center
:width: 80%
```

- La creación de una nueva plantilla se basa en los siguientes datos:

La creación de una nueva plantilla se basa en los siguientes datos:

**1. Título de la Plantilla**
- Propósito: Nombre identificativo y claro de la plantilla.

- Ejemplo: "Propuesta Estándar - App Móvil", "Contrato Base de Desarrollo Web", "Checklist de Entrega Final".

**2. Descripción Detallada**
- Propósito: Explicar el objetivo de la plantilla, su contenido principal, y el contexto en el que debe ser utilizada. Esta es la guía para el desarrollador que la vaya a utilizar.

- Contenido Sugerido: Indicar qué secciones incluye (ej. Alcance, Cronograma, Presupuesto) y qué partes deben ser personalizadas para cada proyecto específico.

**3. URL de la Imagen / Seleccionar Archivo**
- Propósito: Proporcionar una referencia visual rápida de la plantilla.

- Uso: Subir una imagen (como un mockup o una captura de pantalla) que muestre el diseño o la estructura general del documento final que se generará. Esto es especialmente útil para plantillas de diseño o UI/UX.

**4. Enlace a la Demo (Opcional)**
- Propósito: Ofrecer una vista previa funcional o interactiva del contenido que generará la plantilla.

- Uso: Si la plantilla es para un componente de software o un demo de diseño (por ejemplo, una plantilla de panel de administración), se puede enlazar a una versión en vivo para que el desarrollador la revise antes de usarla.

---

**Flujo de Uso de las Plantillas**

- Creación: El desarrollador llena los campos para guardar una estructura reutilizable.

- Uso en Proyectos: Al recibir una Solicitud de Proyecto (formulario), el desarrollador selecciona la plantilla más adecuada (ej. "Propuesta Estándar"), la cual se rellena automáticamente con la información del cliente, acelerando el proceso de elaboración de la Propuesta de Valor.

```{image} _static/Plantilla_Datos.png
:alt: Crear plantilla desarrollador en Code_Craft
:align: center
:width: 50%
```

---

## Disponible

El botón de estado "Disponible" (o su contraparte "No Disponible") es un mecanismo crucial que permite al desarrollador gestionar su capacidad de trabajo y al sistema regular la recepción de nuevas Propuestas de Valor.

```{image} _static/Disponible.png
:alt: Disponible desarrollador en Code_Craft
:align: center
:width: 50%
```

```{image} _static/No_Disponible.png
:alt: No, Disponible desarrollador en Code_Craft
:align: center
:width: 50%
```

**Estado:**  Disponible
Significado: El desarrollador tiene capacidad de trabajo libre y está listo para asumir nuevas responsabilidades.

Implicación en el Flujo de Trabajo:

- Puede recibir y analizar nuevas Solicitudes de Proyecto enviadas por los clientes (a través del formulario).
- Tiene el tiempo para elaborar y enviar la Propuesta de Valor para proyectos nuevos.
- Está preparado para iniciar la Elaboración de un nuevo proyecto en un plazo breve una vez que se cierre el acuerdo.

**Estado:**  No Disponible (Implicado por la Oposición)
Significado: El desarrollador está activamente involucrado en la elaboración de uno o varios proyectos (que están en el estado Activos en su Panel). Su capacidad está al máximo para cumplir con los Plazos Máximos de Entrega acordados.

Implicación en el Flujo de Trabajo:

- Prioridad Absoluta: Cumplir con los hitos y plazos de los proyectos que ya se están elaborando.
- Restricción de Nuevos Trabajos: El sistema debe limitar o detener la asignación de nuevas Solicitudes o la expectativa de que el desarrollador elabore nuevas Propuestas de Valor. Esto evita el sobreesfuerzo y garantiza la calidad en la entrega de los proyectos en curso.

