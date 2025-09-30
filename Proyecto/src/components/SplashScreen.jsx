import React, { useState, useEffect, useCallback } from 'react';
import './SplashScreen.css';

// Las imágenes se cargan desde la carpeta 'public'
const IMAGES = {
  apagado: 'bombillo-apagado.png',
  medio: 'bombillo-medio.png',
  encendido: 'bombillo-encendido.jpeg',
};

const SplashScreen = ({ onAnimationEnd }) => {
  // Estado para controlar la imagen de la bombilla
  const [bombillaSrc, setBombillaSrc] = useState(IMAGES.apagado);
  // Estado para controlar la clase que inicia la animación CSS
  const [isAnimating, setIsAnimating] = useState(false);
  // Estado para controlar si el texto ya debe ser visible para su animación
  const [showText, setShowText] = useState(false);

  // Función para manejar la redirección/fin de la animación
  const handleAnimationEnd = useCallback(() => {
    // Si la animación es un splash screen completo, probablemente querrás una redirección
    // o un cambio de estado en el componente padre (App.js)
    if (onAnimationEnd) {
      onAnimationEnd();
    } else {
      // Tu lógica original era redirigir:
      // window.location.href = "static/index/index.html"; 
    }
  }, [onAnimationEnd]);


  useEffect(() => {
    // 1. Iniciar la animación de la bombilla inmediatamente (clase 'encender')
    // El keyframe 'encenderBombillo' manejará los cambios de imagen y escala.
    setIsAnimating(true);

    // 2. Transiciones de imagen (simulando los cambios de 'src' del JS original)
    // El CSS maneja la animación visual, pero necesitamos el cambio de la fuente (src)
    // para replicar el comportamiento exacto de tu keyframe:
    
    // 100ms: Apagado -> Medio (aunque el CSS lo hace con el keyframe)
    // El keyframe hace el cambio en 30%, que es aproximadamente 750ms de 2500ms
    setTimeout(() => {
        setBombillaSrc(IMAGES.medio);
    }, 700); // Ajuste basado en el 30% del tiempo total (2.5s * 0.3 = 0.75s)

    // 2500ms: Medio -> Encendido
    setTimeout(() => {
      setBombillaSrc(IMAGES.encendido);
    }, 2500);

    // 3. Iniciar la animación de "escribirYBorrar" del texto después de 3000ms
    setTimeout(() => {
      setShowText(true);
    }, 3000);

    // 4. Fin de la animación y redirección/ocultar splash screen (9000ms)
    setTimeout(() => {
        // Ejecuta la función de fin de animación
        handleAnimationEnd();
    }, 9000);

    // Cleanup de los timers al desmontar el componente
    return () => {
      clearTimeout(700);
      clearTimeout(2500);
      clearTimeout(3000);
      clearTimeout(9000);
    };
  }, [handleAnimationEnd]);

  return (
    // Reemplazamos la etiqueta <div class="container"> por el id #splash para el CSS
    <div id="splash" className={isAnimating ? 'active' : ''}>
        <div className="container">
            {/* Usamos el estado 'bombillaSrc' para el 'src' */}
            <img 
                src={bombillaSrc} 
                className={`bombillo ${isAnimating ? 'encender' : ''}`} 
                id="bombillo" 
                alt="Bombilla de animación"
            />
            
            {/* El texto se hace visible solo después de los 3000ms */}
            <div 
                className={`texto ${showText ? 'animating' : ''}`} 
                id="texto"
                style={showText ? { animation: "escribirYBorrar 6s steps(13) forwards" } : {}}
            >
                &lt;Code_Craft&gt;
            </div>
        </div>
    </div>
  );
};

export default SplashScreen;