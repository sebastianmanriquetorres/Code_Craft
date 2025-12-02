import React from 'react';
    import { motion } from 'framer-motion';
    import { Mail } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { differenceInHours } from 'date-fns';

    const PaymentPage = ({ currentUser, projects, users }) => {
      const myProjectsToPay = projects.filter(p => p.client_id === currentUser.id && p.status === 'completed');

      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          <h1 className="text-3xl font-bold text-foreground mb-6">Proyectos Finalizados</h1>
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            {myProjectsToPay.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No tienes proyectos finalizados.</p>
            ) : (
              <div className="space-y-4">
                {myProjectsToPay.map(project => {
                  const developer = users.find(u => u.id === project.developer_id);
                  const isNew = project.completed_at && differenceInHours(new Date(), new Date(project.completed_at)) < 24;
                  return (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">Desarrollador: {developer?.name || 'N/A'}</p>
                          <p className="text-lg font-bold text-primary">${project.price || 0}</p>
                        </div>
                        {isNew && <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">Recién Terminado</Badge>}
                      </div>
                      {developer && (
                         <div className="text-right">
                             <p className="text-sm text-muted-foreground mb-1">Contacto del Desarrollador:</p>
                             <a href={`mailto:${developer.email}`} className="font-semibold text-primary hover:underline flex items-center justify-end gap-2">
                                <Mail className="w-4 h-4" />
                                {developer.email}
                            </a>
                         </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      );
    };

    export default PaymentPage;