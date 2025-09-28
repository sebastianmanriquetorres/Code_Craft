// src/components/PlantillaData.js
import React, { useState } from 'react';
import NavBar from '../components/NavBar.jsx';
import FormularioProyecto from '../components/FormularioProyecto.jsx';
import Card from '../components/Card.jsx';
import '../styles/cliente.css';

const Plantillas = () => {
  const [busqueda, setBusqueda] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  // Ejemplo de datos de plantillas
  const plantillas = [
    { id: 1, nombre: 'Landing Page', descripcion: 'Página de aterrizaje moderna.' },
    { id: 2, nombre: 'E-commerce', descripcion: 'Tienda online completa.' },
    // ...más plantillas
  ];

  const filtradas = mostrarFavoritos
    ? plantillas.filter(p => favoritos.includes(p.id))
    : plantillas.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div>
      <NavBar
        onSearch={setBusqueda}
        onMostrarFavoritos={() => setMostrarFavoritos(true)}
        onVolver={() => setMostrarFavoritos(false)}
      />
      <FormularioProyecto />
      <div className="plantillas-lista">
        {filtradas.map(p => (
          <Card key={p.id} plantilla={p} />
        ))}
      </div>
    </div>
  );
};

export const plantillas = [
  {
    id: 1,
    nombre: "Adidas",
    imagenes: [
      "images/adidas.PNG",
      "https://via.placeholder.com/400x200?text=Adidas+2",
      "https://via.placeholder.com/400x200?text=Adidas+3",
    ],
    descripcion: "Diseño deportivo moderno y dinámico.",
    usos: ["Catálogo de ropa", "E-commerce", "Promociones", "Eventos deportivos"],
    lenguaje: "",
    activa: true,
  },
  {
    id: 2,
    nombre: "Aston Martin",
    imagenes: ["images/Astonmartin.png", "https://via.placeholder.com/400x200?text=Aston+2"],
    descripcion: "Estilo sofisticado inspirado en marcas de lujo.",
    usos: [
      "Catálogo de autos",
      "Reservas",
      "Servicios exclusivos",
      "Portafolio visual",
    ],
    activa: true,
  },
  {
    id: 3,
    nombre: "ICFES",
    imagenes: ["images/icfes.png", "https://via.placeholder.com/400x200?text=ICFES+2"],
    descripcion: "Enfoque educativo para evaluaciones y pruebas académicas.",
    usos: [
      "Plataforma educativa",
      "Resultados",
      "Gestión académica",
      "Simulacros",
    ],
    activa: true,
  },
  {
    id: 4,
    nombre: "Microsoft",
    imagenes: [
      "images/microsoft.PNG",
      "https://via.placeholder.com/400x200?text=Microsoft+2",
      "https://via.placeholder.com/400x200?text=Microsoft+3",
    ],
    descripcion: "Diseño empresarial y corporativo.",
    usos: [
      "Software",
      "Servicios en la nube",
      "Herramientas de productividad",
      "Empresas",
    ],
    lenguaje: "",
    activa: true,
  },
  {
    id: 5,
    nombre: "Canva",
    imagenes: [
      "images/canva.png",
      "https://via.placeholder.com/400x200?text=Canva+2",
      "https://via.placeholder.com/400x200?text=Canva+3",
    ],
    descripcion: "Diseño creativo y personalizable.",
    usos: ["Diseño gráfico", "Plantillas", "Portafolios", "Proyectos visuales"],
    lenguaje: "",
    activa: true,
  },
  {
    id: 6,
    nombre: "Spotify",
    imagenes: [
      "images/spotify.PNG",
      "https://via.placeholder.com/400x200?text=Spotify+2",
      "https://via.placeholder.com/400x200?text=Spotify+3",
    ],
    descripcion: "Plantilla ideal para música y streaming.",
    usos: ["Reproducción de música", "Listas de reproducción", "Streaming", "Podcast"],
    lenguaje: "",
    activa: true,
  },
  {
    id: 7,
    nombre: "Pinterest",
    imagenes: [
      "images/pinterest.PNG",
      "https://via.placeholder.com/400x200?text=Pinterest+2",
      "https://via.placeholder.com/400x200?text=Pinterest+3",
    ],
    descripcion: "Inspiración visual y colecciones.",
    usos: ["Galerías", "Ideas creativas", "Portafolio", "Inspiración"],
    lenguaje: "",
    activa: true,
  },
  {
    id: 8,
    nombre: "Classroom",
    imagenes: [
      "images/clasroom.PNG",
      "https://via.placeholder.com/400x200?text=Classroom+2",
      "https://via.placeholder.com/400x200?text=Classroom+3",
    ],
    descripcion: "Perfecta para instituciones educativas y clases en línea.",
    usos: [
      "Gestión académica",
      "Clases online",
      "Compartir materiales",
      "Evaluaciones",
    ],
    lenguaje: "",
    activa: true,
  },
  {
    id: 9,
    nombre: "LinkedIn",
    imagenes: [
      "images/linkedin.PNG",
      "https://via.placeholder.com/400x200?text=LinkedIn+2",
      "https://via.placeholder.com/400x200?text=LinkedIn+3",
    ],
    descripcion: "Red profesional para networking.",
    usos: [
      "Portafolio profesional",
      "Conexiones",
      "Ofertas laborales",
      "Empresas",
    ],
    lenguaje: "",
    activa: true,
  },
  {
    id: 10,
    nombre: "Instagram",
    imagenes: [
      "images/instagram.PNG",
      "https://via.placeholder.com/400x200?text=Instagram+2",
      "https://via.placeholder.com/400x200?text=Instagram+3",
    ],
    descripcion: "Plantilla enfocada en contenido visual y social.",
    usos: ["Fotos", "Historias", "Influencers", "Comunidades"],
    lenguaje: "",
    activa: true,
  },
  {
    id: 11,
    nombre: "Didi",
    imagenes: [
      "images/DIDI.PNG",
      "https://via.placeholder.com/400x200?text=Didi+2",
      "https://via.placeholder.com/400x200?text=Didi+3",
    ],
    descripcion: "Movilidad y transporte urbano.",
    usos: [
      "Reservas de viajes",
      "Transporte",
      "Servicios rápidos",
      "Usuarios",
    ],
    lenguaje: "",
    activa: true,
  },
  {
    id: 12,
    nombre: "Mercado Libre",
    imagenes: [
      "images/Mercadolibre.PNG",
      "https://via.placeholder.com/400x200?text=Mercado+Libre+2",
      "https://via.placeholder.com/400x200?text=Mercado+Libre+3",
    ],
    descripcion: "E-commerce líder en Latinoamérica.",
    usos: ["Marketplace", "Compras", "Ventas", "Métodos de pago"],
    lenguaje: "",
    activa: true,
  },
  {
    id: 13,
    nombre: "Messenger",
    imagenes: [
      "images/MESENGER.PNG",
      "https://via.placeholder.com/400x200?text=Messenger+2",
      "https://via.placeholder.com/400x200?text=Messenger+3",
    ],
    descripcion: "Plantilla para mensajería y comunicación.",
    usos: ["Chat", "Videollamadas", "Comunicación instantánea", "Red social"],
    lenguaje: "",
    activa: true,
  },
  {
    id: 14,
    nombre: "YouTube",
    imagenes: [
      "images/Youtube.PNG",
      "https://via.placeholder.com/400x200?text=YouTube+2",
      "https://via.placeholder.com/400x200?text=YouTube+3",
    ],
    descripcion: "Contenido multimedia y video.",
    usos: ["Streaming", "Videos", "Canales", "Monetización"],
    lenguaje: "",
    activa: true,
  },
  {
    id: 15,
    nombre: "Netflix",
    imagenes: [
      "images/netflix.PNG",
      "https://via.placeholder.com/400x200?text=Netflix+2",
      "https://via.placeholder.com/400x200?text=Netflix+3",
    ],
    descripcion: "Plataforma de entretenimiento audiovisual.",
    usos: ["Series", "Películas", "Streaming", "Suscripciones"],
    lenguaje: "",
    activa: true,
  },
  {
    id: 16,
    nombre: "Amazon",
    imagenes: [
      "images/Amazon.PNG",
      "https://via.placeholder.com/400x200?text=Amazon+2",
      "https://via.placeholder.com/400x200?text=Amazon+3",
    ],
    descripcion: "Marketplace global con variedad de productos.",
    usos: [
      "E-commerce",
      "Marketplace",
      "Servicios en la nube",
      "Prime",
    ],
    lenguaje: "",
    activa: true,
  },
  {
    id: 17,
    nombre: "Facebook",
    imagenes: [
      "images/Facebook.PNG",
      "https://via.placeholder.com/400x200?text=Facebook+2",
      "https://via.placeholder.com/400x200?text=Facebook+3",
    ],
    descripcion: "Red social global para comunidades.",
    usos: [
      "Amigos",
      "Comunidades",
      "Eventos",
      "Marketing digital",
    ],
    lenguaje: "",
    activa: true,
  },
  {
    id: 18,
    nombre: "TikTok",
    imagenes: [
      "images/TIKTOK.PNG",
      "https://via.placeholder.com/400x200?text=TikTok+2",
      "https://via.placeholder.com/400x200?text=TikTok+3",
    ],
    descripcion: "Plataforma de videos cortos y tendencias.",
    usos: [
      "Videos cortos",
      "Contenido viral",
      "Influencers",
      "Publicidad",
    ],
    lenguaje: "",
    activa: true,
  },
];

export default Plantillas;