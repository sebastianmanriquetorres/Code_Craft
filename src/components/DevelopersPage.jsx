
import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const DevelopersPage = ({ users, reviews, currentUser, projects }) => {
  const allDevelopers = users.filter(u => u.role === 'developer');
  const myProjectDeveloperIds = projects
    .filter(p => p.clientId === currentUser.id && p.developerId)
    .map(p => p.developerId);

  const handleContactAttempt = (developerId) => {
    if (myProjectDeveloperIds.includes(developerId)) {
      toast({
        title: "📬 Abriendo Chat",
        description: "Puedes hablar con este desarrollador a través del widget de chat.",
      });
      // Aquí podrías añadir lógica para abrir el chat directamente
    } else {
      toast({
        title: "⛔ Acceso Restringido",
        description: "Solo puedes hablar con los desarrolladores que están trabajando en tus proyectos.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h1 className="text-3xl font-bold text-foreground mb-6">Desarrolladores</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allDevelopers.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-12">No hay desarrolladores registrados.</p>
        ) : (
          allDevelopers.map(dev => <DeveloperCard key={dev.id} developer={dev} reviews={reviews} onContact={handleContactAttempt} />)
        )}
      </div>
    </motion.div>
  );
};

const DeveloperCard = ({ developer, reviews, onContact }) => {
  const devReviews = reviews.filter(r => r.developerId === developer.id);
  const avgRating = devReviews.length > 0 ? (devReviews.reduce((acc, r) => acc + r.rating, 0) / devReviews.length).toFixed(1) : 'N/A';
  
  const cardVariants = {
    available: "border-green-500/50 hover:border-green-500",
    unavailable: "border-red-500/50 hover:border-red-500"
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }} 
      className={`bg-card border-2 rounded-xl p-6 text-center shadow-sm transition-colors ${developer.available ? cardVariants.available : cardVariants.unavailable}`}
    >
      <div className="relative inline-block">
        <img src={developer.avatar} alt={developer.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-background" />
        <div className={`absolute bottom-4 right-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-card ${developer.available ? 'bg-green-500' : 'bg-red-500'}`}>
          {developer.available ? <CheckCircle className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />}
        </div>
      </div>
      <h4 className="font-bold text-lg">{developer.name}</h4>
      <div className="flex items-center justify-center gap-1 my-2 text-muted-foreground">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span>{avgRating} ({devReviews.length} reseñas)</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center my-4 min-h-[2.5rem]">
        {developer.skills?.map(s => <span key={s} className="px-2 py-1 text-xs bg-secondary rounded">{s}</span>)}
      </div>
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => onContact(developer.id)}
      >
        <MessageCircle className="w-4 h-4 mr-2" />Contactar
      </Button>
    </motion.div>
  );
};

export default DevelopersPage;
