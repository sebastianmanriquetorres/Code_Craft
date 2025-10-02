import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                {/* Contactanos */}
                <div className="footer-content">
                    <h3>Contactanos</h3>
                    <p>Email: Proyectcode_craft@gmail.com</p>
                    <p>Phone: +121 56556 565556</p>
                    <p>Address: Your Address 123 street</p>
                </div>
                
                {/* Enlaces rapidos */}
                <div className="footer-content">
                    <h3>Enlaces rapidos</h3>
                    <ul className="list">
                        <li><a href="#top">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#portafolio">Products</a></li>
                        <li><a href="#contacto">Contact</a></li>
                    </ul>
                </div>
                
                {/* Follow Us (Redes Sociales) */}
                <div className="footer-content">
                    <h3>Follow Us</h3>
                    <ul className="social-icons">
                        {/* Se asume que estás cargando Font Awesome o Boxicons */}
                        <li><a href=""><i className="fab fa-facebook"></i></a></li> 
                        <li><a href=""><i className="fab fa-twitter"></i></a></li>
                        <li><a href=""><i className="fab fa-instagram"></i></a></li>
                        <li><a href=""><i className="fab fa-linkedin"></i></a></li>
                    </ul>
                </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="bottom-bar">
                <p>&copy; 2025 Code_Craft. Todos los derechos reservados</p>
            </div>
        </footer>
    );
};

export default Footer;