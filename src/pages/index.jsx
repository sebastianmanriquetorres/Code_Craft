import React, { useState } from 'react';
import '../styles/Index.css'; 
// Importar el nuevo componente del carrusel
import Carousel from '../components/carousel';

const Index = () => {
    // 1. Estado para manejar el menú responsive (reemplaza script.js)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Función que se ejecuta al hacer clic en el ícono del menú
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // 2. Renderizado del Carrusel (se reemplaza el placeholder)
    const renderCarousel = () => {
        return (
            <section className="carousel-section" id="products">
                {/* Aquí inyectamos el componente del carrusel */}
                <Carousel />
            </section>
        );
    };

    // 3. Renderizado de la Estructura (Navbar, Main, Footer)
    return (
        <>
            {/* ========================================================= */}
            {/* HEADER / NAVBAR (Migrado de index.html y script.js) */}
            {/* ========================================================= */}
            <header className="header">
                {/* Asumo que el logo es un link a la sección 'home' */}
                <a href="#" className="logo">
                    {/* Reemplaza 'img/logo.png' con la ruta real */}
                    <img src="logo.png" alt="Logo Code Craft" />
                </a>

                {/* El div.nav-bg que se activa/desactiva */}
                <div className={`nav-bg ${isMenuOpen ? 'active' : ''}`}></div>

                {/* La barra de navegación que se activa/desactiva */}
                <nav className={`navbar ${isMenuOpen ? 'active' : ''}`}>
                    <a href="#home" onClick={isMenuOpen ? toggleMenu : undefined}>Home</a>
                    <a href="#about" onClick={isMenuOpen ? toggleMenu : undefined}>About</a>
                    <a href="#services" onClick={isMenuOpen ? toggleMenu : undefined}>Services</a>
                    <a href="#products" onClick={isMenuOpen ? toggleMenu : undefined}>Products</a>
                    <a href="#contact" onClick={isMenuOpen ? toggleMenu : undefined}>Contact</a>
                    {/* Esto es un placeholder para el cuadrado azul del nav */}
                    <div className="box"></div> 
                </nav>

                {/* Ícono de menú (Boxicons) */}
                <div 
                    id="menu-icon" 
                    className={`bx bx-menu ${isMenuOpen ? 'bx-x' : ''}`}
                    onClick={toggleMenu} // Evento onClick de React
                ></div>
            </header>

            {/* ========================================================= */}
            {/* MAIN CONTENT (Contenedor principal) */}
            {/* ========================================================= */}
            <main>
                <section className="hero-section" id="home">
                    {/* Contenido de la sección hero */}
                    <h1>
                        Bienvenido a <br />
                        <span style={{color: '#3a4bbd'}}>CODE_CRAFT</span>.
                    </h1>
                    <p>
                        Creamos soluciones de software a medida que impulsan el crecimiento y la eficiencia de tu negocio.
                    </p>
                    {/* ... más contenido del hero ... */}
                </section>

                {renderCarousel()}
            </main>

            {/* ========================================================= */}
            {/* FOOTER (Migrado de index.html) */}
            {/* ========================================================= */}
            <footer>
                <div className="container">
                    <div className="footer-content">
                        <h3>Contactanos</h3>
                        <p>Email: Proyectcode_craft@gmail.com</p>
                        <p>Phone: +121 56556 565556</p>
                        <p>Address: Your Address 123 street</p>
                    </div>
                    <div className="footer-content">
                        <h3>Enlaces rapidos</h3>
                        <ul className="list">
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#products">Products</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-content">
                        <h3>Follow Us</h3>
                        <ul className="social-icons">
                            {/* Usando iconos de Boxicons, si FontAwesome no está disponible */}
                            <li><a href="#"><i className="bx bxl-facebook"></i></a></li>
                            <li><a href="#"><i className="bx bxl-twitter"></i></a></li>
                            <li><a href="#"><i className="bx bxl-instagram"></i></a></li>
                            <li><a href="#"><i className="bx bxl-linkedin"></i></a></li>
                        </ul>
                    </div>
                </div>
                <div className="bottom-bar">
                    <p>&copy; 2025 Code_Craft. Todos los derechos reservados</p>
                </div>
            </footer>
        </>
    );
};

export default Index;
