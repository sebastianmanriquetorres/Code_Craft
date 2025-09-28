import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/Carousel.css'; // Importamos los estilos que ya creamos.

// Datos de ejemplo para las tarjetas del carrusel (reemplaza las imágenes/contenido reales)
const initialItems = [
    { id: 1, title: 'Diseño Web', description: 'Creamos interfaces intuitivas y modernas.', image: '../public/img1.png' },
    { id: 2, title: 'Desarrollo Backend', description: 'Sistemas robustos y escalables con Node.js y Python.', image: '../public/img2.png' },
    { id: 4, title: 'Consultoría', description: 'Análisis y estrategia para tu transformación digital.', image: '../public/img4.png' },
    { id: 5, title: 'Cloud Solutions', description: 'Migración y gestión de infraestructura en la nube.', image: '../public/img3.png' },
];

const TIME_RUNNING = 2000; // Duración de la animación (usada en CSS)
const TIME_AUTO_NEXT = 8000; // Tiempo de avance automático

const Carousel = () => {
    // Estado principal: La lista de elementos del carrusel en su orden actual.
    const [sliderItems, setSliderItems] = useState(initialItems);
    // El índice del elemento activo (el primero en la lista siempre es el activo)
    const [activeId, setActiveId] = useState(initialItems[0].id);
    // Estado para aplicar las clases 'next' o 'prev' (para animaciones CSS)
    const [carouselClass, setCarouselClass] = useState('');

    // Referencia para el temporizador de avance automático
    const [autoPlayTimer, setAutoPlayTimer] = useState(null);

        // NUEVO ESTADO: Para bloquear los clics mientras se ejecuta la animación.
    const [isAnimating, setIsAnimating] = useState(false); 

    

    // Función principal para mover el carrusel (reemplaza showSlider(type) de app.js)
// Función principal para mover el carrusel
    const showSlider = useCallback((type) => {
        // Bloquea nuevos movimientos mientras se realiza esta animación.
        setIsAnimating(true); 
        
        setCarouselClass(type);
        
        setSliderItems(prevItems => {
            // ... lógica de movimiento (shift/pop) ...
            const itemsCopy = [...prevItems];
            let newItems;
            
            if (type === 'next') {
                const firstItem = itemsCopy.shift();
                newItems = [...itemsCopy, firstItem];
            } else { // 'prev'
                const lastItem = itemsCopy.pop();
                newItems = [lastItem, ...itemsCopy];
            }
            
            setActiveId(newItems[0].id);
            return newItems;
        });

        // Limpieza de la clase 'next' o 'prev' y DESACTIVACIÓN del bloqueo después de TIME_RUNNING
        const animationTimeout = setTimeout(() => {
            setCarouselClass('');
            setIsAnimating(false); // ¡IMPORTANTE! Desactivar el bloqueo aquí.
        }, TIME_RUNNING); // Usamos la constante de 2000ms

        return () => clearTimeout(animationTimeout);
    }, []);

    // Reiniciar el temporizador de avance automático cada vez que se mueve
    const startAutoPlay = useCallback(() => {
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
        }
        const newTimer = setTimeout(() => {
            showSlider('next');
        }, TIME_AUTO_NEXT);
        setAutoPlayTimer(newTimer);
    }, [showSlider, autoPlayTimer]);

    // Hook principal para manejar el avance automático
    useEffect(() => {
        startAutoPlay();
        // Limpieza: Asegura que el temporizador se detenga al desmontar el componente
        return () => {
            if (autoPlayTimer) {
                clearTimeout(autoPlayTimer);
            }
        };
    }, [startAutoPlay, autoPlayTimer]);


    // Función de click para los botones
// Función de click para los botones
    const handleSliderClick = (type) => {
        // Bloquear el clic si una animación ya está en curso (el tiempo de espera/bloqueo)
        if (isAnimating) {
            return; 
        }

        // Detener el auto-play temporalmente
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
        }
        
        // Ejecutar el movimiento
        showSlider(type);
        
        // Reiniciar el auto-play
        startAutoPlay();
    };

    // Estructura de los ítems del thumbnail
    const thumbnailItems = useMemo(() => {
        // En el thumbnail, el primero es el último en el DOM (como en tu app.js original)
        // Por lo tanto, invertimos el orden de la lista principal (o ajustamos el CSS si es necesario)
        const reversedItems = [...sliderItems].reverse(); 
        
         return reversedItems.map((item) => (
            <div 
                key={item.id} 
                className={`item ${item.id === activeId ? 'active' : ''}`}
                // Aquí iría el onClick para seleccionar un thumbnail
            >
                <img src={item.image} alt={item.title} />
                <div className="content">
                    {/* El thumbnail original no tiene título, pero podemos agregarlo */}
                    <div className="title">{item.title}</div>
                    {/* Aquí la info es diferente, solo una subcadena de la descripción */}
                    <div className="description">{item.description.substring(0, 30)}...</div>
                </div>
            </div>
        ));
    }, [sliderItems, activeId]); // ESTO ESTÁ CORRECTO. La información ya es diferente.


    // Renderizado del componente Carrusel
    return (
        <section className={`carousel ${carouselClass}`}>
            {/* Contenedor principal del Slider */}
            <div className="list">
                {sliderItems.map((item, index) => (
                    <div 
                        key={item.id} 
                        // El primer elemento de la lista (index === 0) es el activo
                        className={`item ${index === 0 ? 'active' : ''}`} 
                    >
                        <img src={item.image} alt={item.title} />
                        <div className="content">
                            <div className="author">CODE CRAFT</div>
                            <div className="title">{item.title}</div>
                            <div className="topic">SOLUCIONES TECNOLÓGICAS</div>
                            <div className="des">{item.description}</div>
                            <div className="buttons">
                                <button>VER MÁS</button>
                                <button>CONTÁCTANOS</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Botones de control (reemplazan #next y #prev) */}
            <div className="arrows">
                <button id="prev" onClick={() => handleSliderClick('prev')}>{'<'}</button>
                <button id="next" onClick={() => handleSliderClick('next')}>{'>'}</button>
            </div>

            {/* Thumbnails (Miniaturas) */}
            <div className="thumbnail">
                {thumbnailItems}
            </div>

            {/* Barra de tiempo de auto-play (solo visual) */}
            <div className="time"></div>
        </section>
    );
};

export default Carousel;
