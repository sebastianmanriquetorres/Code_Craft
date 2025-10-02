import React, { useState, useEffect, useCallback } from 'react';

// Datos de los items del carrusel (Tomados del index.html)
const CAROUSEL_ITEMS = [
    { img: '/imagenes/img1.png', author: 'CODE_CRAFT', title: 'Buscar Plantillas', topic: 'Entre mas de 1000', des: 'Explora bases prediseñadas...', buttons: ['Explorar', 'Info'], thumbTitle: 'Buscar plantillas', thumbDesc: null },
    { img: '/imagenes/img2.png', author: 'CODE_CRAFT', title: 'Sobre Nosotros', topic: 'Conocenos', des: 'Conoce nuestra experiencia...', buttons: ['Explorar', 'Info'], thumbTitle: 'Sobre nosotros', thumbDesc: null },
    { img: '/imagenes/img3.png', author: 'CODE_CRAFT', title: 'Proyectos', topic: 'Completados y en desarrollo', des: 'Explora los proyectos terminados...', buttons: ['Explorar', 'Info'], thumbTitle: 'Proyectos', thumbDesc: null },
    { img: '/imagenes/img4.png', author: 'CODE_CRAFT', title: 'Contacto', topic: 'Comunicate con nosotros.', des: '¿Necesitas ayuda? Escríbenos...', buttons: ['Contactos', 'Atencion al cliente.'], thumbTitle: 'Contacto', thumbDesc: '¿Necesitas ayuda?' },
];

const TIME_RUNNING = 1000; // 1s de tu app.js
const TIME_AUTO_NEXT = 8000; // 8s de tu app.js

const Carousel = () => {
    // El orden de los items en el array simula la posición en el carrusel
    const [items, setItems] = useState(CAROUSEL_ITEMS);
    // Controla si se debe aplicar la clase 'next' o 'prev' para animaciones CSS
    const [carouselClass, setCarouselClass] = useState('');

    const showSlider = useCallback((type) => {
        // Bloquear si ya hay una animación en curso
        if (carouselClass !== '') return;

        setCarouselClass(type);
        let newItems = [...items];

        if (type === 'next') {
            // Rotar: Mover el primer elemento al final
            const firstItem = newItems.shift();
            newItems.push(firstItem);
        } else {
            // Rotar: Mover el último elemento al principio
            const lastItem = newItems.pop();
            newItems.unshift(lastItem);
        }
        
        setItems(newItems);

        // Limpiar la clase de animación después del tiempo de transición (1s)
        const timeoutId = setTimeout(() => {
            setCarouselClass('');
        }, TIME_RUNNING);

        return () => clearTimeout(timeoutId);
    }, [items, carouselClass]);
    
    // Auto-play con useEffect, reinicia al moverse el carrusel
    useEffect(() => {
        const autoNext = setTimeout(() => {
            showSlider('next');
        }, TIME_AUTO_NEXT);

        return () => clearTimeout(autoNext); // Cleanup para reiniciar el timer
    }, [items, showSlider]); // Depende de `items` para que el timer se reinicie con cada slide.

    return (
        <div className={`carousel animate-on-scroll ${carouselClass}`}>
            {/* Time Bar (solo CSS) */}
            <div className="time"></div> 
            
            {/* List of Items (Slides) */}
            <div className="list">
                {items.map((item, index) => (
                    // El primer elemento (index === 0) es el activo
                    <div key={index} className={`item ${index === 0 ? 'active' : ''}`}> 
                        <img src={item.img} alt={`Slide ${index + 1}`} />
                        <div className="content">
                            <div className="author">{item.author}</div>
                            <div className="title">{item.title}</div>
                            <div className="topic">{item.topic}</div>
                            <div className="des">{item.des}</div>
                            <div className="buttons">
                                <button>{item.buttons[0]}</button>
                                <button>{item.buttons[1]}</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Thumbnail List */}
            <div className="thumbnail">
                {items.map((item, index) => (
                    <div 
                        key={`thumb-${index}`} 
                        className="item animate-on-scroll" 
                        // Nota: Tu lógica original no permitía hacer click en los thumbs para saltar, 
                        // solo se movían con el carrusel. Mantenemos esa funcionalidad.
                        // Si quisieras que el click funcione, sería una lógica más compleja de React.
                    >
                        <img src={item.img} alt={`Thumbnail ${index + 1}`} />
                        <div className="content">
                            <div className="title">{item.thumbTitle}</div>
                            {item.thumbDesc && <div className="description">{item.thumbDesc}</div>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Arrows */}
            <div className="arrows">
                <button id="prev" onClick={() => showSlider('prev')}>&lt;</button>
                <button id="next" onClick={() => showSlider('next')}>&gt;</button>
            </div>
        </div>
    );
};

export default Carousel;