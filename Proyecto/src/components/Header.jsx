import React, { useState } from 'react';

const Header = () => {
    // Estado para controlar si el menú móvil está activo
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Función para manejar el clic en el ícono del menú
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Función para hacer scroll al inicio al hacer clic en el logo
    const scrollToTop = (e) => {
        e.preventDefault(); 
        document.getElementById('top').scrollIntoView({
            behavior: 'smooth'
        });
    };

    return (
        <header className="header">
            {/* Logo */}
            <a href="#top" className="logo" id="logo" onClick={scrollToTop}>
                <img src="/imagenes/logo.png" alt="logo" />
            </a>

            {/* Navbar */}
            <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
                {/* Search Box */}
                <div className="box">
                    <input type="text" placeholder="Buscar..." />
                    <a href="#">
                        <i className="bx bx-search" style={{ color: '#00abf0' }}></i>
                    </a>
                </div>
                
                {/* Links */}
                <div className="links">
                    <a href="#top" className="activate" onClick={() => setIsMenuOpen(false)}>home</a>
                    <a href="#about" onClick={() => setIsMenuOpen(false)}>about</a>
                    <a href="#services" onClick={() => setIsMenuOpen(false)}>services</a>
                    <a href="#portafolio" onClick={() => setIsMenuOpen(false)}>portafolio</a>
                    <a href="#contacto" onClick={() => setIsMenuOpen(false)}>contacto</a>
                </div>
            </nav>

            {/* Menu Icon (Hamburguesa) */}
            <i 
                className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'}`} 
                id="menu-icon" 
                onClick={handleMenuToggle}
            ></i>
        </header>
    );
};

export default Header;