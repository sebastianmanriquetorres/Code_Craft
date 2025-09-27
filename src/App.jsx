import React, { useState, useEffect } from 'react';

// Importamos los componentes que creamos
// RUTA CORREGIDA: Especificamos explícitamente la extensión .jsx
import Animacion from './components/animacion.jsx'; 
import Index from './pages/index.jsx';

// Tiempo total de la animación (9000ms o 9 segundos, como en tu splash.js)
const ANIMATION_DURATION_MS = 9000;

const App = () => {
    // Estado para controlar si ya se debe mostrar el contenido principal
    const [showMainContent, setShowMainContent] = useState(false);

    // useEffect se usa para simular el temporizador de tu código original
    useEffect(() => {
        // Establece un temporizador para cambiar el estado después de la duración de la animación
        const timer = setTimeout(() => {
            setShowMainContent(true);
        }, ANIMATION_DURATION_MS);

        // Función de limpieza: Se ejecuta al desmontar el componente
        return () => clearTimeout(timer);
    }, []); // El array vacío asegura que solo se ejecute una vez al montar

    return (
        <div className="app-container">
            {/* Si showMainContent es falso, mostramos la animación */}
            {!showMainContent && (
                // Pasamos la duración como prop para que el componente Animacion pueda
                // sincronizar sus propios temporizadores y animaciones CSS
                <Animacion duration={ANIMATION_DURATION_MS} />
            )}

            {/* Si showMainContent es verdadero, mostramos la página principal */}
            {showMainContent && (
                <Index />
            )}
        </div>
    );
};

export default App;
