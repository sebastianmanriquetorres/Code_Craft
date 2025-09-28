import React from 'react';

const Card = ({ plantilla }) => (
  <div className="card">
    <h3>{plantilla.nombre}</h3>
    <p>{plantilla.descripcion}</p>
    {/* Puedes agregar más detalles o botones aquí */}
  </div>
);

export default Card;