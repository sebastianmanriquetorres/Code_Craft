import React, { useState } from "react";
import ProyectoCard from "./ProyectoCard";

export default function MainContent({ section }) {
  const [proyectos] = useState([
    { id: 1, nombre: "Lanzamiento App - Cliente A", cliente: "Carlos Pérez", porcentaje: 50, info: "App móvil multiplataforma." },
    { id: 2, nombre: "Web Corporativa - Cliente B", cliente: "Lucía Gómez", porcentaje: 28, info: "Sitio web institucional." }
  ]);

  return (
    <main className="main">
      {section === "proyectos" && (
        <>
          <header className="main-header">
            <h2 className="page-title">Proyectos</h2>
            <div className="header-actions">
              <input className="search" placeholder="Buscar proyecto..." />
              <button className="ghost-btn">Filtrar</button>
            </div>
          </header>
          <section className="projects">
            {proyectos.map(p => (
              <ProyectoCard key={p.id} proyecto={p} />
            ))}
          </section>
        </>
      )}

      {section === "clientes" && <h2 className="page-title">Clientes atendidos</h2>}
      {section === "tareas" && <h2 className="page-title">Trabajos terminados</h2>}
      {section === "plantilla" && <h2 className="page-title">Catálogo de plantillas</h2>}
    </main>
  );
}
