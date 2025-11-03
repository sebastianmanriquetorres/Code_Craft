
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Mail, ExternalLink } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


const ShoppingCart = ({ isCartOpen, setIsCartOpen }) => {
  const { cartItems, removeFromCart } = useCart();

  const handleDemoClick = (demoUrl) => {
    window.open(demoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card/80 backdrop-blur-xl shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">Favoritos</h2>
              <Button onClick={() => setIsCartOpen(false)} variant="ghost" size="icon" className="text-foreground hover:bg-accent">
                <X />
              </Button>
            </div>
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                  <Heart size={48} className="mb-4" />
                  <p>Tu lista de favoritos está vacía.</p>
                  <p className="text-sm mt-2">Añade plantillas desde la galería.</p>
                </div>
              ) : (
                <TooltipProvider>
                  {cartItems.map(item => (
                    <div key={item.variant.id} className="flex items-center gap-4 bg-secondary/50 p-3 rounded-lg relative">
                      <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded-md" />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-foreground">{item.product.title}</h3>
                        <p className="text-sm text-muted-foreground">Por: {item.templateData?.profiles?.name}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {item.templateData?.demo_link && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button onClick={() => handleDemoClick(item.templateData.demo_link)} size="icon" variant="outline" className="h-8 w-8">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Ver Demo</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button onClick={() => removeFromCart(item.variant.id)} size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-500/10">
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Quitar de Favoritos</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </TooltipProvider>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
