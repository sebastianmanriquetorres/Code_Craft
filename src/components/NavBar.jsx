// src/components/NavBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

const NavBar = ({ onSearch, onMostrarFavoritos, onVolver }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Lógica para cerrar el menú al hacer clic fuera (igual que en el JS original)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        buttonRef.current && 
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const cerrarSesion = () => {
    Swal.fire({
      title: "Sesión cerrada",
      text: "La sesión se cerró correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
    setIsMenuOpen(false);
  };

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  }

  return (
    <div className="navbar">
      <div className="navbar-left">
        {/* La ruta de la imagen debe ser relativa a la carpeta 'public' */}
        <img src="images/1000012106.png" alt="Logo Code Craft" className="logo" />
        <div className="user">👤 USUARIO</div>
      </div>
      <div className="navbar-right">
        <div className="search-box">
          <input 
            type="text" 
            id="buscador" 
            placeholder="      <Buscar Plantilla>  " 
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="power-container">
          <button 
            id="powerBtn" 
            ref={buttonRef}
            className={`btn-power ${isMenuOpen ? 'active' : ''}`}
            onClick={handleToggleMenu}
          >
            ◯
          </button>
          <div id="powerMenu" ref={menuRef} className={`power-menu ${isMenuOpen ? '' : 'hidden'}`}>
            <button onClick={cerrarSesion}>Cerrar Sesión</button>
            <button onClick={() => { onMostrarFavoritos(); setIsMenuOpen(false); }}>Plantillas Favoritas</button>
            <button id="inicioBtn" onClick={() => { onVolver(); setIsMenuOpen(false); }}>Inicio</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;