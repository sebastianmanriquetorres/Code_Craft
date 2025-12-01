
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, User, DollarSign, Percent, Clock } from 'lucide-react';

const ProjectDetailsModal = ({ project, onClose, currentUser }) => {
  if (!project) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500 text-white">En Progreso</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 text-white">Completado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AnimatePresence>
      <Dialog open={!!project} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-2xl bg-card border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">{project.title}</DialogTitle>
            <DialogDescription>{project.description}</DialogDescription>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <strong>Cliente:</strong> {project.client_id ? 'Asignado' : 'No asignado'}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <strong>Developer:</strong> {project.developer_id ? 'Asignado' : 'No asignado'}
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <strong>Precio:</strong> {project.price ? `$${project.price}` : 'No definido'}
              </div>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-primary" />
                <strong>Progreso:</strong> {project.progress || 0}%
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <strong>Fecha de entrega:</strong> {formatDate(project.delivery_date)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <strong>Estado:</strong> {getStatusBadge(project.status)}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={onClose} variant="outline">
                <X className="mr-2 h-4 w-4" /> Cerrar
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};

export default ProjectDetailsModal;
