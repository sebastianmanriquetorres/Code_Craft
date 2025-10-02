import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./styles/MainStyles.css";

import SplashScreen from "./components/SplashScreen";
import Header from "./components/Header";
import Carousel from "./components/Carousel";
import Footer from "./components/Footer";

import Login from "./Pages/Login";

const AnimatedBombillos = () => (
  <div className="bombillos">
    {Array.from({ length: 7 }).map((_, i) => (
      <img key={i} src="/imagenes/logoapagado.png" alt="Bombillo" />
    ))}
  </div>
);

const Home = () => (
  <div id="top">
    <Header />
    <main>
      <div className="hero-section">
        <div className="hero-content">
          <h1>
            Bienvenido a <span>Code_Craft</span>
          </h1>
          <p>Aquí encontrarás todo lo que necesitas para tu proyecto digital.</p>
          <div className="btn-box">
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/login">Registrarse</Link>
          </div>
        </div>
        <div className="hero-img">
          <img src="/imagenes/logo.png" alt="hero" />
        </div>
      </div>

      <section>
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
        <div className="wave wave4"></div>
      </section>
      <div className="wave-shadow"></div>

      <Carousel />
      <AnimatedBombillos />
    </main>
    <Footer />
  </div>
);

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashEnd = () => setShowSplash(false);

  return (
    <Router>
      {showSplash ? (
        <SplashScreen onAnimationEnd={handleSplashEnd} />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
