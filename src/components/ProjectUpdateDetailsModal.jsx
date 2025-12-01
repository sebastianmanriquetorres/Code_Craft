
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Percent, Link as LinkIcon, User, FileText, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ProjectUpdateDetailsModal = ({ update, onClose, users }) => {
  if (!update) return null;

  const developer = users.find(u => u.id === update.developer_id);
  
  const isImage = (fileName) => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(fileName);

  return (
    <AnimatePresence>
      <Dialog open={!!update} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-center">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Avance del {new Date(update.created_at).toLocaleDateString()}
                </DialogTitle>
            </div>
          </DialogHeader>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6 mt-2"
          >
            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-secondary/30 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img 
                            src={developer?.avatar || "https://api.dicebear.com/7.x/avataaars/svg"} 
                            alt={developer?.name} 
                            className="w-12 h-12 rounded-full border-2 border-primary"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
                            <User className="w-3 h-3 text-primary" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Desarrollador</p>
                        <p className="font-bold">{developer?.name || 'Desconocido'}</p>
                    </div>
                </div>
                
                <div className="flex flex-col justify-center space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium flex items-center gap-2">
                            <Percent className="w-4 h-4" /> Progreso Reportado:
                        </span>
                        <span className="font-bold text-primary text-lg">{update.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                            className="bg-primary h-full transition-all duration-500" 
                            style={{ width: `${update.progress_percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Descripción del Avance</h4>
                <div className="bg-background border rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed">
                    {update.description}
                </div>
            </div>

            {/* Preview Link */}
            {update.preview_link && (
                <div className="space-y-2">
                     <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Enlace de Previsualización</h4>
                     <a 
                        href={update.preview_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-400 hover:underline bg-blue-500/10 p-3 rounded-md transition-colors"
                    >
                        <LinkIcon className="w-4 h-4" />
                        {update.preview_link}
                    </a>
                </div>
            )}

            {/* Attachments */}
            {update.attachments && update.attachments.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Archivos Adjuntos ({update.attachments.length})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {update.attachments.map((file, idx) => (
                            <div key={idx} className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-all">
                                {isImage(file.name) ? (
                                    <div className="aspect-video bg-black/5 relative overflow-hidden">
                                        <img src={file.url} alt={file.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-white bg-black/50 p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                                                <ImageIcon className="w-5 h-5" />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-secondary/50 flex flex-col items-center justify-center p-4 text-center">
                                        <FileText className="w-10 h-10 text-muted-foreground mb-2" />
                                        <p className="text-xs font-medium truncate w-full px-2">{file.name}</p>
                                    </div>
                                )}
                                <div className="p-2 bg-card border-t flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground truncate max-w-[70%]">{file.name}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
                                        <a href={file.url} download target="_blank" rel="noopener noreferrer">
                                            <Download className="w-3 h-3" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <Button onClick={onClose}>Cerrar Detalle</Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};

export default ProjectUpdateDetailsModal;
