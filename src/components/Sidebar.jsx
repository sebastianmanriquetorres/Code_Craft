import React from "react";
import logo from "../assets/bombillo-encendido.jpeg";

export default function Sidebar({ setSection }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img className="logo" src={logo} alt="Logo" />
        <h1 className="brand-title">Mi sitio de trabajo</h1>
      </div>

      <nav className="nav">
        <button className="nav-item active" onClick={() => setSection("proyectos")}>
          <span>Proyectos</span>
        </button>
        <button className="nav-item" onClick={() => setSection("clientes")}>
          <span>Clientes</span>
        </button>
        <button className="nav-item" onClick={() => setSection("tareas")}>
          <span>Terminados</span>
        </button>
        <button className="nav-item primary-btn" onClick={() => setSection("plantilla")}>
          <span>Actualizar plantilla</span>
        </button>
        <button className="nav-item" onClick={() => alert("Sesión cerrada")}>
          <span>Cerrar sesión</span>
        </button>
      </nav>
    </aside>
  );
}
