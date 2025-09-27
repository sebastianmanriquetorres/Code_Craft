import React, { useState, useEffect } from 'react';
import '../styles/animacion.css'; 

// Asumimos que las imágenes están en la carpeta /public
const IMG_APAGADO = '../public/bombillo-apagado.png'; 
const IMG_MEDIO = '/bombillo-medio.png';
const IMG_ENCENDIDO = '/bombillo-encendido.jpeg'; 

// Recibe una función `onComplete` del padre para notificar cuando terminar
const Animacion = ({ onComplete }) => {
    const [bombilloSrc, setBombilloSrc] = useState(IMG_APAGADO); 
    const [textoStyle, setTextoStyle] = useState({});
    const [isFadingOut, setIsFadingOut] = useState(false); // Para la clase fade-out

    useEffect(() => {
        // La secuencia de setTimeout de tu script.js, traducida a React:
        
        // 1. Bombillo a medio (100ms) - Transforma y cambia opacidad
        const timer1 = setTimeout(() => {
            setBombilloSrc(IMG_MEDIO);
            // NOTA: Las transformaciones se manejarán con CSS, no con React styles inline.
            // La clase '.bombillo' en Animacion.css tiene las transiciones.
        }, 1500); 

        // 2. Bombillo a encendido (2500ms)
        const timer2 = setTimeout(() => {
            setBombilloSrc(IMG_ENCENDIDO);
        }, 2500); 

        // 3. Animación de texto (3000ms)
        const timer3 = setTimeout(() => {
            setTextoStyle({ opacity: '1', animation: 'escribirYBorrar 6s steps(13) forwards' });
        }, 3000);

        // 4. Iniciar Fade-out (9000ms)
        const timer4 = setTimeout(() => {
            setIsFadingOut(true); // Aplica la clase .fade-out
            
            // 5. Quitar el componente del DOM después de la transición (9000ms + 600ms)
            const timer5 = setTimeout(() => {
                onComplete(); // Notifica al componente App.jsx que oculte el Splash
            }, 600);
            
            return () => clearTimeout(timer5);

        }, 9000);

        // Función de limpieza: Limpia todos los timers cuando el componente se desmonta.
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [onComplete]); 

    // JSX: reemplaza el HTML de tu index.html
    return (
        <div className={`animacion-splash ${isFadingOut ? 'fade-out' : ''}`}>
            <div className="container">
                <img 
                    // El `src` cambia con el estado de React
                    src={bombilloSrc} 
                    className="bombillo"
                    alt="Bombillo Code Craft" 
                />
                <div 
                    className="texto" 
                    // Los estilos del texto se aplican directamente aquí
                    style={textoStyle}
                >
                    &lt;Code_Craft&gt;
                </div>
            </div>
        </div>
    );
};

export default Animacion;