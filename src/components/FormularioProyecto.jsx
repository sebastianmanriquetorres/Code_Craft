// src/components/FormularioProyecto.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const FormularioProyecto = ({ onVolver }) => {
  const [formData, setFormData] = useState({
    nombreProyecto: '',
    tipoProyecto: '',
    descripcionProyecto: '',
    fechaReunion: '',
    horaReunion: '',
  });
  const [agendarVisible, setAgendarVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAgendarReunion = () => {
    setAgendarVisible(prev => !prev);
  };

  const enviarFormulario = () => {
    const { nombreProyecto, tipoProyecto, descripcionProyecto, fechaReunion, horaReunion } = formData;
    
    if (!nombreProyecto || !tipoProyecto || !descripcionProyecto) {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa los campos obligatorios del proyecto (nombre, tipo y descripción).",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    let mensaje = "¡Gracias! En breve nos pondremos en contacto contigo para empezar a crear tu proyecto.";
    
    if (agendarVisible && fechaReunion && horaReunion) {
      mensaje = `¡Gracias! Recibimos tu solicitud y confirmaremos tu reunión para el ${fechaReunion} a las ${horaReunion}.`;
    }

    Swal.fire({
      title: "Proyecto Enviado",
      text: mensaje,
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(() => {
      onVolver();
    });
  };

  return (
    <div id="formularioProyecto" className="form-plantilla">
      <h2>¡Inicia tu nuevo proyecto!</h2>
      <p>Cuéntanos un poco sobre lo que necesitas para que podamos ayudarte.</p>
      
      <div className="form-group">
        <label htmlFor="nombreProyecto">Nombre del proyecto:</label>
        <input 
          type="text" 
          id="nombreProyecto" 
          name="nombreProyecto" 
          placeholder="Escribe el nombre de tu proyecto" 
          required 
          value={formData.nombreProyecto}
          onChange={handleChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="tipoProyecto">Tipo de proyecto:</label>
        <select 
          id="tipoProyecto" 
          name="tipoProyecto" 
          required
          value={formData.tipoProyecto}
          onChange={handleChange}
        >
          <option value="">Selecciona una opción</option>
          <option value="ecommerce">E-commerce</option>
          <option value="portafolio">Portafolio</option>
          <option value="blog">Blog</option>
          <option value="corporativo">Sitio Corporativo</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="descripcionProyecto">Descripción del proyecto:</label>
        <textarea 
          id="descripcionProyecto" 
          name="descripcionProyecto" 
          rows="4" 
          placeholder="Describe brevemente tu idea y funcionalidades que necesitas." 
          required
          value={formData.descripcionProyecto}
          onChange={handleChange}
        ></textarea>
      </div>

      <button className="btn-yellow" onClick={toggleAgendarReunion}>Agendar nuestra reunión</button>

      <div id="agendarReunion" className={agendarVisible ? '' : 'hidden'}>
        <h3>¿Te gustaría agendar una reunión?</h3>
        <div className="form-group">
          <label htmlFor="fechaReunion">Fecha de la reunión:</label>
          <input 
            type="date" 
            id="fechaReunion" 
            name="fechaReunion"
            value={formData.fechaReunion}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="horaReunion">Hora de la reunión:</label>
          <input 
            type="time" 
            id="horaReunion" 
            name="horaReunion"
            value={formData.horaReunion}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="btn-green" onClick={enviarFormulario}>Enviar</button>
      <button className="btn-back" onClick={onVolver}>⬅ Volver a plantillas</button>
    </div>
  );
};

export default FormularioProyecto;