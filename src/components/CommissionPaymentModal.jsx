
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import StripePaymentForm from '@/components/StripePaymentForm';

const CommissionPaymentModal = ({ isOpen, onClose, project, currentUser }) => {
  const commissionAmount = (project.price * 0.10).toFixed(2);
  const [step, setStep] = useState('form'); // form, success

  const handleSuccess = async (paymentMethod) => {
    try {
        // 1. Register Commission Payment in Supabase
        const { error: commissionError } = await supabase.from('commissions').insert({
            project_id: project.id,
            developer_id: currentUser.id,
            agreed_price: project.price,
            commission_amount: commissionAmount,
            payment_status: 'paid',
            payment_date: new Date().toISOString()
        });

        if (commissionError) throw commissionError;

        // 2. Mark Project as Liquidated
        const { error: projectError } = await supabase.from('projects').update({
            commission_paid: true
        }).eq('id', project.id);

        if (projectError) throw projectError;

        // 3. Notify Admin
        // Find an admin to notify (just taking the first one found for simplicity)
        const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin').limit(1);
        
        if (admins && admins.length > 0) {
            await supabase.from('internal_notifications').insert({
                recipient_id: admins[0].id,
                sender_id: currentUser.id,
                project_id: project.id,
                message: `💰 PAGO RECIBIDO: El desarrollador ${currentUser.name} ha pagado la comisión de $${commissionAmount} por el proyecto "${project.title}".`,
            });
        }

        setStep('success');
    } catch (error) {
        toast({ title: "Error en el proceso", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={step === 'success' ? onClose : undefined}>
      <DialogContent className="sm:max-w-[500px]">
        <AnimatePresence mode="wait">
            {step === 'form' && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <DialogHeader>
                        <DialogTitle>Pagar Comisión - Stripe</DialogTitle>
                        <DialogDescription>
                           Completa el pago de la comisión para finalizar el proyecto.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="bg-secondary/30 p-4 rounded-lg my-4 space-y-2 border border-border">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Proyecto:</span>
                            <span className="font-medium truncate max-w-[200px]">{project.title}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Precio Acordado:</span>
                            <span className="font-medium">${project.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Comisión (10%):</span>
                            <span className="font-bold text-red-500">-${commissionAmount}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between items-center">
                            <span className="font-bold">Total a Pagar:</span>
                            <span className="text-2xl font-bold text-primary">${commissionAmount}</span>
                        </div>
                    </div>

                    <Elements stripe={stripePromise}>
                        <StripePaymentForm 
                            amount={commissionAmount} 
                            onSuccess={handleSuccess} 
                            onCancel={onClose} 
                            loading={false} 
                        />
                    </Elements>
                </motion.div>
            )}

            {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-2 animate-bounce">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-bold">¡Pago Exitoso!</h3>
                    <p className="text-muted-foreground max-w-xs">
                        La comisión ha sido registrada y el proyecto <strong>{project.title}</strong> ha sido marcado como liquidado.
                    </p>
                    <div className="flex gap-2 w-full pt-4">
                         <Button className="w-full" onClick={onClose}>Volver al Dashboard</Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default CommissionPaymentModal;
