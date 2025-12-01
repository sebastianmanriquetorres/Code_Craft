import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const DevelopersPage = ({ currentUser, users, reviews }) => {
  const [selectedDev, setSelectedDev] = useState(null);
  const developers = users.filter(u => u.role === 'developer');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <AnimatePresence>
        {selectedDev && (
          <DeveloperProfileModal
            dev={selectedDev}
            reviews={reviews.filter(r => r.developer_id === selectedDev.id)}
            users={users}
            onClose={() => setSelectedDev(null)}
            currentUser={currentUser}
          />
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-bold text-foreground mb-6">Explorar Desarrolladores</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {developers.map(dev => {
          const devReviews = reviews.filter(r => r.developer_id === dev.id);
          const avgRating = devReviews.length > 0 ? devReviews.reduce((acc, r) => acc + r.rating, 0) / devReviews.length : 0;
          return (
            <motion.div key={dev.id} layoutId={`dev-card-${dev.id}`} onClick={() => setSelectedDev(dev)} whileHover={{ y: -5, scale: 1.02 }} className="bg-card border rounded-lg p-6 shadow-sm cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <img src={dev.avatar} alt={dev.name} className="w-24 h-24 rounded-full mb-4" />
                <h3 className="font-bold text-lg">{dev.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Star className={`w-4 h-4 ${avgRating > 0 ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                  <span>{avgRating.toFixed(1)} ({devReviews.length} reseñas)</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {dev.skills?.slice(0, 3).map(skill => <span key={skill} className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">{skill}</span>)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};


const DeveloperProfileModal = ({ dev, reviews, users, onClose, currentUser }) => {
  const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        layoutId={`dev-card-${dev.id}`}
        className="bg-card rounded-xl p-8 w-full max-w-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4"><X className="h-4 w-4" /></Button>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
          <img src={dev.avatar} alt={dev.name} className="w-32 h-32 rounded-full flex-shrink-0" />
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold">{dev.name}</h2>
            <div className="flex items-center gap-2 text-muted-foreground mt-2 justify-center sm:justify-start">
              <Star className={`w-5 h-5 ${avgRating > 0 ? 'text-yellow-400 fill-yellow-400' : ''}`} />
              <span className="font-semibold">{avgRating.toFixed(1)}</span>
              <span>({reviews.length} valoraciones)</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              {dev.skills?.map(skill => <span key={skill} className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">{skill}</span>)}
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-4">Reseñas y Valoraciones</h3>
        <div className="space-y-6">
          {reviews.length > 0 ? reviews.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).map(review => (
            <ReviewItem 
              key={review.id} 
              review={review} 
              client={users.find(u => u.id === review.client_id)} 
              isOwner={currentUser?.id === dev.id}
            />
          )) : (
            <p className="text-muted-foreground">Este desarrollador aún no tiene reseñas.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ReviewItem = ({ review, client, isOwner }) => {
  const { toast } = useToast();
  const [responseType, setResponseType] = useState(review.developer_response_type);
  const [responseComment, setResponseComment] = useState(review.developer_response_comment || '');
  const [isResponding, setIsResponding] = useState(false);
  const [currentResponseAction, setCurrentResponseAction] = useState(null);

  const handleResponseClick = (type) => {
    setCurrentResponseAction(type);
    setIsResponding(true);
  };
  
  const handleCancelResponse = () => {
    setIsResponding(false);
    setCurrentResponseAction(null);
    setResponseComment(review.developer_response_comment || '');
  };

  const handleSaveResponse = async () => {
    const { error } = await supabase
      .from('reviews')
      .update({
        developer_response_type: currentResponseAction,
        developer_response_comment: responseComment,
      })
      .eq('id', review.id);

    if (error) {
      toast({ title: 'Error al guardar respuesta', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Respuesta guardada con éxito' });
      setResponseType(currentResponseAction);
      setIsResponding(false);
    }
  };


  return (
    <div className="border-b pb-6 last:border-b-0">
      <div className="flex items-start gap-4">
        <img src={client?.avatar} alt={client?.name} className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{client?.name}</p>
              <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />)}</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
          
          {isOwner && !responseType && !isResponding && (
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => handleResponseClick('agree')}>
                <ThumbsUp className="w-4 h-4 mr-2" /> Estoy de acuerdo
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleResponseClick('disagree')}>
                <ThumbsDown className="w-4 h-4 mr-2" /> No estoy de acuerdo
              </Button>
            </div>
          )}

          <AnimatePresence>
          {isResponding && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-4 space-y-2">
              <textarea
                value={responseComment}
                onChange={(e) => setResponseComment(e.target.value)}
                placeholder={currentResponseAction === 'agree' ? 'Añade un comentario de agradecimiento...' : 'Explica por qué no estás de acuerdo...'}
                className="w-full p-2 bg-background border rounded h-20"
              />
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={handleCancelResponse}>Cancelar</Button>
                <Button size="sm" onClick={handleSaveResponse}>Guardar Respuesta</Button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          {responseType && !isResponding && (
            <div className="mt-4 bg-secondary p-3 rounded-md">
              <div className="flex items-center gap-2 font-semibold text-sm">
                {responseType === 'agree' ? <ThumbsUp className="w-4 h-4 text-green-500" /> : <ThumbsDown className="w-4 h-4 text-red-500" />}
                Respuesta del desarrollador
              </div>
              <p className="text-sm text-muted-foreground mt-1">{responseComment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevelopersPage;