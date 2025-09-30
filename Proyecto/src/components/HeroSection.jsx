import React from 'react';

const HeroSection = () => {
    return (
        // Usamos la clase 'hero-section' del index para el contenedor principal
        <div id="hero" className="hero-section">
            <div className="hero-content">
                {/* Títulos y párrafos con la clase hero-content para animaciones CSS */}
                <h1>Bienvenido a<span> Code_Craft</span></h1>
                <p>Aquí encontrarás todo lo que necesitas para tu proyecto digital.</p>
                <div className="btn-box">
                    {/* Botones */}
                    <a href="../login_registro/login.html">Iniciar sesión</a>
                    <a href="#">Registrarse</a>
                </div>
            </div>
            <div className="hero-img">
                {/* Imagen del logo en el hero */}
                <img src="/imagenes/logo.png" alt="hero" />
            </div>

            {/* Este div era para el efecto hover/animación de entrada en el CSS original */}
            <div className="home-imgHover"></div>

            {/* Las olas son una sección separada que se coloca debajo visualmente gracias al CSS */}
            {/* Las olas se renderizan *después* del contenido principal del hero */}
            <section className="waves-container"> 
                <div className="wave wave1"></div>
                <div className="wave wave2"></div>
                <div className="wave wave3"></div>
                <div className="wave wave4"></div>
            </section>
            
            {/* Sombra de la ola */}
            <div className="wave-shadow"></div>
        </div>
    );
};

export default HeroSection;