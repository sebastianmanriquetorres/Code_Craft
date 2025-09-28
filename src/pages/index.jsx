import React, { useState } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import '../styles/Index.css'; 
// Importar el nuevo componente del carrusel
import Carousel from '../components/carousel';

const Index = () => {
    // 1. Estado para manejar el menú responsive (reemplaza script.js)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
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
    // index.jsx
// ... (imports y estado) ...

    return (
        <>
            {/* ========================================================= */}
            {/* HEADER / NAVBAR */}
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
                {/* Ejemplo asumiendo que quieres ir a rutas específicas: */}
                <Link to="/" onClick={isMenuOpen ? toggleMenu : undefined}>Home</Link>
                <Link to="/about" onClick={isMenuOpen ? toggleMenu : undefined}>About</Link>
                <Link to="/services" onClick={isMenuOpen ? toggleMenu : undefined}>Services</Link>
                <Link to="/products" onClick={isMenuOpen ? toggleMenu : undefined}>Products</Link>
                <Link to="/contact" onClick={isMenuOpen ? toggleMenu : undefined}>Contact</Link>
                <div className="box"></div> 
            </nav>

                {/* Ícono de menú (Boxicons) */}
                <div 
                    id="menu-icon" 
                    className={`bx bx-menu ${isMenuOpen ? 'bx-x' : ''}`}
                    onClick={toggleMenu} // Evento onClick de React
                ></div>

                {/* NUEVO: Contenedor de Búsqueda (Punto 3) */}
                <div className="search-container">
                    <input type="text" className="search-input" placeholder="Buscar..." />
                    <i className='bx bx-search-alt'></i>
                </div>
            </header>

            {/* ========================================================= */}
            {/* MAIN CONTENT (Contenedor principal) */}
            {/* ========================================================= */}
            <main>
                                <section className="hero-section" id="home">
                    
                    {/* NUEVO: Contenedor de Contenido de Texto (Punto 5 y 6) */}
                    <div className="hero-content">
                        <h1>
                            Bienvenido A <br />
                            {/* CAMBIO: Usamos la clase de estilo en lugar de inline-style */}
                            <span>Code_Craft</span>.
                        </h1>
                        <p>
                            Aquí encontrarás todo lo que necesitas para tu proyecto digital.
                        </p>
                        {/* NUEVO: Contenedor de Botones (Punto 6) */}
                        <div className="hero-buttons">
                            {/* CAMBIO: Usamos el texto y las clases del CSS */}
                                    <button className="inicio" onClick={() => navigate('/login')}>Iniciar sesión</button>
                            <button className="registro">Registrarse</button>
                        </div>
                    </div> 
                    
                    {/* NUEVO: Contenedor de Imagen (Punto 7) */}
                    <div className="hero-image-container">
                        {/* Reemplaza 'imagen-hero-derecha.png' con la ruta real */}
                        {/* La imagen que mostraste es la bombilla, la usaremos como referencia */}
                        <img src="logo.png" alt="Ilustración de bombilla con código" />
                    </div>
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
