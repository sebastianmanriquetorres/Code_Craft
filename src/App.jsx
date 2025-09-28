import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Animacion from './components/animacion.jsx'; 
import Index from './pages/index.jsx';
import Login from './pages/login.jsx';
// import Signup from './pages/signup.jsx'; // Si tienes este componente

const ANIMATION_DURATION_MS = 9000;

const App = () => {
    const [showMainContent, setShowMainContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowMainContent(true);
        }, ANIMATION_DURATION_MS);
        return () => clearTimeout(timer);
    }, []);

    if (!showMainContent) {
        // Solo muestra la animación al inicio
        return <Animacion duration={ANIMATION_DURATION_MS} />;
    }

    // Cuando termina la animación, muestra el contenido según la ruta
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                {/* <Route path="/signup" element={<Signup />} /> */}
            </Routes>
        </Router>
    );
};

export default App;