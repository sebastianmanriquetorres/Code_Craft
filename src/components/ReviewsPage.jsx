import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const ReviewsPage = ({ currentUser, users, reviews }) => {
  const myReviews = reviews.filter(r => r.developerId === currentUser.id);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h1 className="text-3xl font-bold text-foreground mb-6">Mis Reseñas</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myReviews.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-12">Aún no tienes reseñas.</p>
        ) : (
          myReviews.map(review => {
            const client = users.find(u => u.id === review.clientId);
            return (
              <motion.div key={review.id} whileHover={{ y: -5 }} className="bg-card border rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <img src={client?.avatar} alt={client?.name} className="w-8 h-8 rounded-full" />
                  <p className="font-semibold">{client?.name}</p>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default ReviewsPage;