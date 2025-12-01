import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft, ArrowRight, Paperclip, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const isImage = (fileName) => /\.(jpg|jpeg|png|gif|svg)$/i.test(fileName);

const FilePreviewer = ({ files }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!files || files.length === 0) {
        return <p className="text-sm text-muted-foreground">No hay archivos adjuntos.</p>;
    }

    const currentFile = files[currentIndex];
    const canGoNext = currentIndex < files.length - 1;
    const canGoPrev = currentIndex > 0;

    return (
        <div className="mt-2">
            <div className="relative bg-secondary/50 rounded-lg p-4 flex items-center justify-center h-64">
                {isImage(currentFile.name) ? (
                    <img src={currentFile.url} alt={currentFile.name} className="max-h-full max-w-full object-contain" />
                ) : (
                    <div className="text-center">
                        {currentFile.name.endsWith('.pdf') ? <FileText className="w-16 h-16 mx-auto text-red-500" /> : <Paperclip className="w-16 h-16 mx-auto text-muted-foreground" />}
                        <p className="mt-2 font-semibold">{currentFile.name}</p>
                        <Button asChild variant="link" size="sm" className="mt-2">
                          <a href={currentFile.url} target="_blank" rel="noopener noreferrer" download>
                            <Download className="w-4 h-4 mr-2"/>Descargar
                          </a>
                        </Button>
                    </div>
                )}
                 {files.length > 1 && (
                    <>
                        <Button size="icon" variant="ghost" className="absolute left-1 top-1/2 -translate-y-1/2" onClick={() => setCurrentIndex(i => i - 1)} disabled={!canGoPrev}>
                            <ArrowLeft />
                        </Button>
                         <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setCurrentIndex(i => i + 1)} disabled={!canGoNext}>
                            <ArrowRight />
                        </Button>
                    </>
                )}
            </div>
            {files.length > 1 && (
                <div className="flex justify-center gap-2 mt-2">
                    {files.map((_, index) => (
                        <button key={index} onClick={() => setCurrentIndex(index)} className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/50'}`}></button>
                    ))}
                </div>
            )}
        </div>
    );
};

const ProjectUpdateModal = ({ data, onClose }) => {
    const { update, project, developer, updateNumber } = data;
    const navigate = useNavigate();

    const handleGoToProject = () => {
        onClose();
        // This is a simple navigation, you might need a more specific route like /project/:id
        navigate('/dashboard'); 
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-card rounded-xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold">Detalle del Avance</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-4">
                    <div>
                        <span className="text-sm font-semibold text-muted-foreground">Proyecto</span>
                        <p className="font-bold text-lg text-primary hover:underline cursor-pointer" onClick={handleGoToProject}>{project?.title}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-semibold text-muted-foreground">Avance #</span>
                            <p className="font-bold">{updateNumber}</p>
                        </div>
                         <div>
                            <span className="font-semibold text-muted-foreground">Fecha</span>
                            <p>{new Date(update.created_at).toLocaleString()}</p>
                        </div>
                        <div>
                            <span className="font-semibold text-muted-foreground">Progreso Total</span>
                            <p className="font-bold text-lg">{update.progress_percentage}%</p>
                        </div>
                    </div>

                     <div>
                        <span className="font-semibold text-muted-foreground">Subido por</span>
                         <div className="flex items-center gap-2 mt-1">
                            <img src={developer?.avatar} alt={developer?.name} className="w-8 h-8 rounded-full"/>
                            <p className="font-semibold">{developer?.name}</p>
                        </div>
                    </div>

                    <div>
                        <span className="font-semibold text-muted-foreground">Descripción</span>
                        <p className="mt-1 bg-secondary/50 p-3 rounded-md text-sm whitespace-pre-wrap">{update.description}</p>
                    </div>

                    <div>
                        <span className="font-semibold text-muted-foreground">Archivos Adjuntos</span>
                        <FilePreviewer files={update.attachments} />
                    </div>
                </div>

                <div className="flex justify-end gap-2 p-6 border-t mt-auto">
                    <Button variant="outline" onClick={onClose}>Cerrar</Button>
                    <Button onClick={handleGoToProject}>Ir al Proyecto</Button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProjectUpdateModal;