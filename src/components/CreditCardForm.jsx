
    import React from 'react';
    import { motion } from 'framer-motion';
    import { X } from 'lucide-react';
    import { Button } from '@/components/ui/button';

    const CreditCardForm = ({ onClose }) => {
      
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }} className="bg-card rounded-2xl shadow-2xl w-full max-w-md relative" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}><X /></Button>
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-center">Funcionalidad Desactivada</h2>
                <p className="text-center text-muted-foreground">El sistema de pagos ha sido desactivado.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      );
    };

    export default CreditCardForm;
  