import React, { useState } from "react";

export default function FooterBar() {
  const [active, setActive] = useState("inicio");

  const handleClick = (section) => {
    setActive(section);
    switch (section) {
      case "inicio":
        alert("Volviste al inicio 🏠");
        break;
      case "mensajes":
        alert("Abriendo mensajes 💬");
        break;
      case "notificaciones":
        alert("Mostrando notificaciones 🔔");
        break;
      case "perfil":
        alert("Entrando a tu perfil 👤");
        break;
      default:
        break;
    }
  };

  return (
    <footer className="footer-bar">
      <button
        className={`footer-btn ${active === "inicio" ? "active" : ""}`}
        onClick={() => handleClick("inicio")}
      >
        Inicio
      </button>
      <button
        className={`footer-btn ${active === "mensajes" ? "active" : ""}`}
        onClick={() => handleClick("mensajes")}
      >
        Mensajes
      </button>
      <button
        className={`footer-btn ${active === "notificaciones" ? "active" : ""}`}
        onClick={() => handleClick("notificaciones")}
      >
        Notificaciones
      </button>
      <button
        className={`footer-btn ${active === "perfil" ? "active" : ""}`}
        onClick={() => handleClick("perfil")}
      >
        Perfil
      </button>
    </footer>
  );
}
