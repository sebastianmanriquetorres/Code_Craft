# 12. Panel Administrador

Tras iniciar sesión, el Administrador accede al dashboard, donde puede visualizar su total de usuarios, proyectos activos, completados, ingresos totales, distribucion de usuarios, estado de proyectos, usuario, proyectos, calendario, plantillas, un icono de luna o sol de tema visual, perfil y salir.


```{image} _static/Panel_Administrador.png
:alt: panel administrador en Code_Craft
:align: center
:width: 80%
```
---

## 1. Indicadores de Cabecera (Métricas Clave)
Estos son los números más importantes que miden el rendimiento general de la plataforma:

 - Total Usuarios (90): Muestra la base total de personas registradas en la plataforma, tanto Clientes (quienes envían solicitudes) como Desarrolladores (quienes elaboran los proyectos).

 - Proyectos Activos (5): Indica cuántos proyectos están actualmente en fase de Elaboración (los que están activos en el calendario de los desarrolladores). Esto refleja la carga de trabajo actual.

 - Proyectos Completados (3): Muestra la cantidad total de proyectos que han finalizado su elaboración, han sido entregados y cerrados (servicios facturados y pagados). Es un indicador de éxito y productividad.

 - Ingresos Totales ($51.120): La suma total de dinero generada por los proyectos completados a través de la plataforma. Es la métrica financiera clave para la administración.

## 2. Distribución de Usuarios
Este gráfico de barras desglosa el Total de Usuarios (90) por rol:

- Clientes: Son los usuarios que inician el proceso enviando la Solicitud de Proyecto (el formulario).

- Desarrolladores: Son los usuarios responsables de analizar las solicitudes, elaborar la Propuesta de Valor y, posteriormente, la Elaboración del Proyecto si se llega a un acuerdo.

- Propósito: Ayuda al administrador a balancear la oferta (desarrolladores) y la demanda (clientes).

## 3. Estado de Proyectos**
Este gráfico circular muestra el estado de todos los proyectos en curso (no solo los activos, sino también los que están en la fase inicial de negociación) y su distribución porcentual:

- En Progreso (56%): Proyectos en fase de Elaboración activa (coincide con los "Proyectos Activos" de la cabecera, pero en porcentaje).

- Completados (33%): Proyectos finalizados, entregados y pagados.

- Abiertos (11%): Proyectos que han sido solicitados (por un cliente) y están pendientes de la respuesta del desarrollador (la Propuesta de Valor). Estos están en la fase de análisis y negociación inicial.

---

## Conexión con el Flujo
El panel de administración se conecta con todo el flujo que hemos estado definiendo:

- La columna "Abiertos" refleja los proyectos recién ingresados por el formulario.

- La columna "En Progreso" refleja la elaboración activa de proyectos por parte de los desarrolladores que están en estado No Disponible.

- Las "Plantillas" y el "Calendario" son herramientas clave para gestionar eficientemente los proyectos En Progreso y pasar más rápido de "Abiertos" a "En Progreso".

---

## Gestion de Usuarios

El panel de Gestión de Usuarios proporciona al administrador una vista completa de todas las personas registradas en CodeCraft, permitiendo la supervisión y el control sobre los dos roles principales: Clientes y Desarrolladores.

```{image} _static/Gestion_usuarios.png
:alt: Gestion administrador en Code_Craft
:align: center
:width: 80%
```

**1. Información Mostrada por Usuario**
Cada entrada en la lista presenta la información clave para identificar y gestionar a la persona:

- Avatar / Iniciales: Una representación visual del usuario.

- Nombre de Usuario y Correo Electrónico: Los datos de contacto y la identificación única de la cuenta.

**2. Roles Clave y su Significado**
La característica más importante del panel es la clara distinción entre roles, lo cual impacta directamente en el flujo de trabajo de proyectos

**3. Acciones del Administrador**
El panel otorga al administrador la capacidad de realizar acciones de mantenimiento y control sobre cada cuenta:

- Editar (Lápiz): Permite al administrador modificar la información del usuario, como el nombre, el correo electrónico o, lo más importante, cambiar el rol (por ejemplo, ascender un cliente con habilidades técnicas al rol de desarrollador, o viceversa).

- Eliminar (Cubo de Basura): Otorga la capacidad de eliminar la cuenta de la plataforma, lo cual se usaría por motivos de seguridad, inactividad o incumplimiento de las políticas.


---


## Vista Global de Proyectos

La "Vista Global de Proyectos" es el panel central donde el administrador supervisa el estado de todos los proyectos que han sido solicitados en la plataforma, desde su ingreso hasta la finalización de la elaboración y el pago.

```{image} _static/Proyectos.png
:alt: Gestion Proyectos en Code_Craft
:align: center
:width: 80%
```

**1. Funcionalidad Clave**
- Buscador: Permite al administrador localizar rápidamente un proyecto por título, nombre de cliente o nombre de desarrollador.

- Filtros de Estado: Las pestañas superiores (Todos, Abiertos, En Progreso, Completados) permiten filtrar la visualización para enfocarse en una fase específica del ciclo de vida del proyecto.

**2. Estados de Proyecto y su Significado**
El panel visualiza el flujo de trabajo completo del proyecto (la transición de la Solicitud a la Entrega y Pago).

**3. Información Mostrada en cada Tarjeta**
Cada tarjeta de proyecto ofrece un resumen crucial para el administrador:

- Título del Proyecto: (Ej. "Clothes").

- Cliente: Nombre y correo electrónico del usuario que generó la Solicitud de Proyecto.

- Desarrollador: Nombre y correo electrónico del profesional asignado que está a cargo de la Elaboración del proyecto.

- Entrega: Fecha Límite acordada para la entrega del proyecto (directamente ligado al campo "Fecha Límite Deseada" del formulario y al Calendario).

- Progreso: El porcentaje que indica el avance de la Elaboración del proyecto. Este dato es clave para que el administrador pueda intervenir si hay retrasos.

Este panel permite al administrador tener una vista de helicóptero sobre toda la operación, garantizando que todos los proyectos se muevan eficientemente a través de las fases de Solicitud, Propuesta, Elaboración y Pago.

---

## Calendario de Proyectos

El Calendario de Proyectos proporciona al administrador una vista de alto nivel de todos los compromisos de la plataforma. Su función principal es la gestión de riesgos y la planificación de la capacidad de los desarrolladores.

```{image} _static/Admin_Calendario.png
:alt: Calendario admin en Code_Craft
:align: center
:width: 80%
```

**1. El Origen de los Eventos en el Calendario**
Los eventos marcados en el calendario provienen directamente de los datos críticos proporcionados por el cliente en la Solicitud de Proyecto y formalizados en la Propuesta de Valor y el Acuerdo.

La fecha más importante que visualiza el administrador es:

- Fecha Límite Deseada: Esta fecha, ingresada por el cliente en la sección "5. Alcance y Tiempos" del formulario de Solicitud, se convierte en el Plazo Máximo de Entrega para el desarrollador una vez que el proyecto pasa a estado Activo.

- Hitos Intermedios (Opcional): El desarrollador también puede marcar fechas clave para la entrega de avances importantes durante la Elaboración del proyecto.

**2. Propósito y Uso para el Administrador**
El administrador utiliza este calendario para tres funciones críticas:

| **Función Administrativa**        | **Conexión con el Flujo de Proyectos**                                                                                                                                                                                                                                                                |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monitoreo de Riesgos**          | Permite ver de un vistazo si la fecha actual (por ejemplo, *lunes, 3 de noviembre*) está muy cerca de la fecha límite de un proyecto grande. Si un proyecto activo está marcado en color de riesgo (amarillo o rojo) al acercarse su Fecha Límite Deseada, el administrador sabe que debe intervenir. |
| **Supervisión de Capacidad**      | Al observar el número de proyectos asignados a cada desarrollador en un mismo mes, el administrador puede confirmar si un desarrollador marcado como *No Disponible* realmente tiene una carga de trabajo completa, justificando su incapacidad para asumir más proyectos.                            |
| **Planificación de Asignaciones** | Facilita la planificación de la asignación de proyectos *Abiertos* (pendientes de propuesta) a desarrolladores que finalizarán sus proyectos en el mes siguiente, asegurando que la plataforma mantenga una capacidad productiva constante.                                                           |

**3. Visualización de Proyectos Activos**

Cada compromiso que está en la fase "En Progreso" o "Listo para Pagar" en la Vista Global de Proyectos tiene su fecha de entrega reflejada en este calendario, permitiendo al administrador gestionar el cumplimiento del cronograma con precisión.

---

## Plantillas

El panel de Galería de Plantillas permite al administrador tener una vista centralizada de todas las plantillas que los desarrolladores han creado para uso interno o para generar la Propuesta de Valor para los clientes.

```{image} _static/Admin_Plantillas.png
:alt: Plantillas admin en Code_Craft
:align: center
:width: 80%
```

**1. Propósito Administrativo**

- Asegurar la Calidad: El administrador puede revisar cada plantilla para verificar que cumpla con los estándares de la plataforma antes de que otros desarrolladores las utilicen.

- Estandarización: Promueve el uso de formatos y estructuras consistentes para la documentación y la Propuesta de Valor, lo cual agiliza el proceso de elaboración.

- Control de Contenido: Permite al administrador aprobar o rechazar plantillas, asegurando que solo se compartan recursos relevantes y profesionales.

**2. Información Visualizada por Plantilla**

Cada tarjeta de plantilla muestra un resumen de la información que se ingresó en el formulario de "Crear Nueva Plantilla":

| **Elemento Visual**         | **Origen de Datos (Formulario de Creación)** | **Importancia en el Flujo**                                                                                                        |
| --------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Imagen de Muestra**       | URL de la imagen / Archivo subido            | Permite al administrador ver rápidamente el aspecto visual o el diseño de la plantilla.                                            |
| **Título de la Plantilla**  | Título de la plantilla                       | Describe el propósito (ej. *“página de zapatos”*).                                                                                 |
| **Creador (Desarrollador)** | Perfil del Desarrollador                     | Indica quién creó la plantilla, crucial para la supervisión y para resolver dudas sobre su uso.                                    |
| **Descripción Breve**       | Descripción detallada                        | Un resumen rápido del contenido o la utilidad de la plantilla.                                                                     |
| **Botón “Ver Demo”**        | Enlace a la demo (opcional)                  | Permite al administrador previsualizar el recurso o código funcional que genera la plantilla antes de su aprobación o uso general. |


**3. Conexión con el Proceso de Elaboración**
Los desarrolladores usan estas plantillas para:

1. Acelerar la Propuesta de Valor: Utilizar una plantilla de propuesta estándar para transformar rápidamente la Solicitud de Proyecto de un cliente en un documento formal de cotización.

2. Facilitar la Elaboración: Usar plantillas de código, estructuras de base de datos o checklists de desarrollo (como la "página de zapatos" en el ejemplo) para empezar a trabajar de manera eficiente una vez que el proyecto está Activo.