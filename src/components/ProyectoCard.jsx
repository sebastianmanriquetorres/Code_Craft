import React from "react";

export default function ProyectoCard({ proyecto }) {
  return (
    <article className="project-card">
      <div className="card-left">
        <h3 className="project-name">{proyecto.nombre}</h3>
        <div className="card-actions">
          <button className="info-btn">Info</button>
          <button className="deliver-btn">Entregar avance</button>
          <button className="unlink-btn">Desvincular</button>
        </div>
        <div className="project-info">{proyecto.info}</div>
      </div>
      <div className="card-right">
        <div className="meta">
          <span className="label">Progreso</span>
          <span className="percent">{proyecto.porcentaje}%</span>
        </div>
        <div className="progress">
          <div className="progress-fill" style={{ width: `${proyecto.porcentaje}%` }}></div>
        </div>
      </div>
    </article>
  );
}
