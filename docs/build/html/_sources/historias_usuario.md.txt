#  Historias de Usuario – Code_Craft

---

##  HU01 – Registro de Usuarios

**Como:** microempresario  
**Quiero:** ingresar mi nombre, correo electrónico y contraseña válidos  
**Para:** registrarme y acceder a la plataforma  

###  Criterios de aceptación
- El sistema valida que el correo no esté registrado previamente.  
- Se muestra un mensaje de confirmación al completar el registro.  
- El usuario es redirigido a su panel de inicio tras registrarse exitosamente.  

---

##  HU02 – Ingreso a la Plataforma

**Como:** usuario registrado  
**Quiero:** iniciar sesión con mis credenciales  
**Para:** acceder a mi panel principal  

###  Criterios de aceptación
- El sistema permite iniciar sesión con correo y contraseña válidos.  
- Si las credenciales son incorrectas, se muestra un mensaje de error.  
- Al iniciar sesión correctamente, el usuario es redirigido a su panel principal.  

---

##  HU03 – Envío de Solicitud de Desarrollo

**Como:** cliente  
**Quiero:** enviar una solicitud con información clave de mi negocio  
**Para:** que el equipo de desarrollo cree un sitio web adaptado a mis necesidades  

###  Criterios de aceptación
- El cliente puede llenar un formulario con nombre del negocio, sector, descripción, referencias y preferencias de estilo.  
- El formulario no se puede enviar si hay campos obligatorios vacíos.  
- Al enviar, se muestra un mensaje de confirmación.  
- El sistema almacena la solicitud y la asigna automáticamente a un desarrollador.  

---

##  HU04 – Visualización de Solicitudes

**Como:** desarrollador  
**Quiero:** ver las solicitudes de proyectos enviadas  
**Para:** organizarlas y comenzar el proceso de creación y modificación  

###  Criterios de aceptación
- El desarrollador puede ver una lista de solicitudes ordenadas por fecha o estado.  
- Cada solicitud muestra datos relevantes del cliente.  
- El desarrollador puede marcar una solicitud como “en desarrollo”, “pendiente” o “finalizado”.  

---

##  HU05 – Selección de Plantilla Base

**Como:** cliente  
**Quiero:** elegir una plantilla base desde el sistema  
**Para:** usarla como punto de partida para el desarrollo del sitio  

###  Criterios de aceptación
- El sistema muestra una galería de plantillas disponibles.  
- El desarrollador puede hacer clic en una plantilla para seleccionarla.  
- El sistema asocia la plantilla seleccionada con la solicitud correspondiente.  

---

##  HU06 – Personalización del Sitio

**Como:** desarrollador  
**Quiero:** modificar la plantilla con la información del cliente  
**Para:** entregarle un proyecto funcional y acorde a sus intereses  

###  Criterios de aceptación
- El desarrollador puede editar textos, imágenes y colores según la solicitud.  
- La información modificada se guarda correctamente.  
- La vista previa refleja los cambios realizados.  
- Los estilos visuales coinciden con las preferencias del cliente.  

---

##  HU07 – Vista Previa del Sitio

**Como:** cliente  
**Quiero:** ver los avances de mi proyecto de forma concreta y medible  
**Para:** verificar qué se ha realizado y qué falta por desarrollar  

###  Criterios de aceptación
- El cliente puede acceder a una vista previa del sitio web.  
- La vista previa refleja fielmente los cambios realizados.  
- El sitio puede visualizarse sin estar publicado oficialmente.  

---

##  HU08 – Aprobación del Sitio Web

**Como:** cliente  
**Quiero:** aprobar o solicitar cambios en mi sitio  
**Para:** asegurarme de que el resultado cumpla con mis expectativas  

###  Criterios de aceptación
- El cliente puede marcar el sitio como “aprobado” o “solicitar cambios”.  
- Si se solicitan cambios, el cliente puede dejar observaciones.  
- El estado de la solicitud cambia automáticamente según la acción del cliente.  

---

##  HU09 – Publicación del Sitio Web

**Como:** cliente  
**Quiero:** visualizar que mi sitio esté listo y recibir el proyecto publicado  
**Para:** acceder a mi sitio web de manera oficial  

###  Criterios de aceptación
- El desarrollador solo puede publicar si el sitio está marcado como “aprobado”.  
- Al publicarse, el sitio es accesible desde una URL o dominio proporcionado.  
- El sistema notifica al cliente que su sitio ya está en línea.  

---
