import React, { useState } from 'react';

const Header = () => {
    // ... (Tu lógica de estado y funciones se mantiene igual)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const scrollToTop = (e) => {
        e.preventDefault(); 
        document.getElementById('top').scrollIntoView({
            behavior: 'smooth'
        });
        if (isMenuOpen) setIsMenuOpen(false);
    };

    return (
        <header className="header">
            {/* Logo */}
            <a href="#top" className="logo" id="logo" onClick={scrollToTop}>
                <img src="/imagenes/logo.png" alt="logo" />
            </a>

            {/* Navbar. Se aplica la clase 'active' para móvil. */}
            <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
                
                {/* Links - Queremos que estén a la IZQUIERDA del buscador */}
                <div className="links">
                    <a href="#top" className="activate" onClick={() => setIsMenuOpen(false)}>home</a>
                    <a href="#about" onClick={() => setIsMenuOpen(false)}>about</a>
                    <a href="#services" onClick={() => setIsMenuOpen(false)}>services</a>
                    <a href="#portafolio" onClick={() => setIsMenuOpen(false)}>portafolio</a>
                    <a href="#contacto" onClick={() => setIsMenuOpen(false)}>contacto</a>
                </div>

                {/* Search Box - Queremos que esté a la DERECHA de los enlaces. */}
                <div className="box">
                    <input type="text" placeholder="Buscar..." />
                    <a href="#">
                        {/* Se mantiene el ícono de búsqueda */}
                        <i className="bx bx-search" style={{ color: '#00abf0' }}></i>
                    </a>
                </div>

            </nav>

            {/* Icono del Menú (Hamburguesa) */}
            <i 
                className={`bx ${isMenuOpen ? 'bx-x' : 'bx-menu'}`} 
                id="menu-icon" 
                onClick={handleMenuToggle}
            ></i>
        </header>
    );
};

export default Header;