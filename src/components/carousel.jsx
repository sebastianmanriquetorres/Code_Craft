import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../styles/Carousel.css'; // Importamos los estilos que ya creamos.

// Datos de ejemplo para las tarjetas del carrusel (reemplaza las imágenes/contenido reales)
const initialItems = [
    { id: 1, title: 'Diseño Web', description: 'Creamos interfaces intuitivas y modernas.', image: '../public/img1.png' },
    { id: 2, title: 'Desarrollo Backend', description: 'Sistemas robustos y escalables con Node.js y Python.', image: '/img/carousel/backend.jpg' },
    { id: 3, title: 'Aplicaciones Móviles', description: 'Experiencias nativas con React Native.', image: '/img/carousel/mobile_app.jpg' },
    { id: 4, title: 'Consultoría', description: 'Análisis y estrategia para tu transformación digital.', image: '/img/carousel/consulting.jpg' },
    { id: 5, title: 'Cloud Solutions', description: 'Migración y gestión de infraestructura en la nube.', image: '/img/carousel/cloud.jpg' },
];

const TIME_RUNNING = 1000; // Duración de la animación (usada en CSS)
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

    // Función principal para mover el carrusel (reemplaza showSlider(type) de app.js)
    const showSlider = useCallback((type) => {
        setCarouselClass(type);
        
        setSliderItems(prevItems => {
            const itemsCopy = [...prevItems];
            let newItems;
            
            if (type === 'next') {
                // Mueve el primer ítem al final (simula appendChild)
                const firstItem = itemsCopy.shift();
                newItems = [...itemsCopy, firstItem];
            } else { // 'prev'
                // Mueve el último ítem al principio (simula prepend)
                const lastItem = itemsCopy.pop();
                newItems = [lastItem, ...itemsCopy];
            }
            
            // Actualiza el ID del nuevo elemento activo (el que está en posición [0])
            setActiveId(newItems[0].id);
            return newItems;
        });

        // Limpieza de la clase 'next' o 'prev' después de la animación CSS (TIME_RUNNING)
        const animationTimeout = setTimeout(() => {
            setCarouselClass('');
        }, TIME_RUNNING);

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
    const handleSliderClick = (type) => {
        // Detener el auto-play temporalmente (se reiniciará en showSlider)
        if (autoPlayTimer) {
            clearTimeout(autoPlayTimer);
        }
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
                    <div className="description">{item.description.substring(0, 30)}...</div>
                </div>
            </div>
        ));
    }, [sliderItems, activeId]);


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
