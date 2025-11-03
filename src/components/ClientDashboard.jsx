import React, { useState, useMemo, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Plus, Check, X, Users, Star, Info, Edit, Trash2, Mail, FolderOpen } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { toast } from '@/components/ui/use-toast';
    import CreateProjectForm from '@/components/CreateProjectForm';
    import { supabase } from '@/lib/customSupabaseClient';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
    } from "@/components/ui/alert-dialog";
    import { useCart } from '@/hooks/useCart';

    const ClientDashboard = ({ currentUser, users, projects, proposals }) => {
      const [showCreateProject, setShowCreateProject] = useState(false);
      const [editingProject, setEditingProject] = useState(null);
      const [deletingProject, setDeletingProject] = useState(null);
      const [templateForProject, setTemplateForProject] = useState(null);
      const { cartItems, removeItem } = useCart();

      useEffect(() => {
        const templateItem = cartItems.find(item => item.type === 'template');
        if (templateItem) {
          setTemplateForProject(templateItem.templateData);
          setShowCreateProject(true);
          removeItem(templateItem.id);
        }
      }, [cartItems, removeItem]);

      const myProjects = useMemo(() => projects.filter(p => p.client_id === currentUser.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), [projects, currentUser.id]);

      const handleFormSubmit = async (projectData) => {
        const isEditing = !!editingProject;
        const dataToSubmit = {
          title: projectData.title,
          project_type: projectData.projectType,
          description: projectData.description,
          languages: projectData.languages,
          frameworks: projectData.frameworks,
          database_type: projectData.database,
          integrations: projectData.integrations,
          features: projectData.features,
          visual_style: projectData.visualStyle,
          colors: projectData.colors,
          reference_links: projectData.references,
          deadline: projectData.deadline || null,
          budget: projectData.budget ? parseFloat(projectData.budget) : null,
          priority: projectData.priority,
          comments: projectData.comments,
          attachments: projectData.attachments || null,
        };

        let error;
        if (isEditing) {
          ({ error } = await supabase.from('projects').update(dataToSubmit).eq('id', editingProject.id));
        } else {
          ({ error } = await supabase.from('projects').insert([{ 
            ...dataToSubmit,
            client_id: currentUser.id,
            status: 'open',
            progress: 0,
            paid: false,
            reviewed: false,
            template_reference: templateForProject ? { title: templateForProject.title, image: templateForProject.image_url, description: templateForProject.description, demo_link: templateForProject.demo_link } : null,
          }]));
        }

        if (error) {
          toast({ title: `❌ Error al ${isEditing ? 'actualizar' : 'crear'} proyecto`, description: error.message, variant: "destructive" });
        } else {
          setShowCreateProject(false);
          setEditingProject(null);
          setTemplateForProject(null);
          toast({ title: `🚀 Proyecto ${isEditing ? 'Actualizado' : 'Creado'}`, description: isEditing ? undefined : "Tu proyecto está ahora visible para los desarrolladores." });
        }
      };

      const handleProposalResponse = async (proposalId, accepted) => {
        const proposal = proposals.find(p => p.id === proposalId);
        if (!proposal) return;

        const updates = [];
        if (accepted) {
          const otherProposals = proposals.filter(p => p.project_id === proposal.project_id && p.id !== proposalId);
          otherProposals.forEach(p => updates.push(supabase.from('proposals').update({ status: 'rejected' }).eq('id', p.id)));
        }
        
        updates.push(supabase.from('proposals').update({ status: accepted ? 'accepted' : 'rejected' }).eq('id', proposalId));

        if (accepted) {
          updates.push(supabase.from('projects').update({
            developer_id: proposal.developer_id,
            price: proposal.price,
            status: 'in-progress'
          }).eq('id', proposal.project_id));
        }

        const results = await Promise.all(updates);
        const hasError = results.some(res => res.error);

        if (hasError) {
          toast({ title: "❌ Error", description: "No se pudo actualizar la propuesta.", variant: "destructive" });
        } else {
          if (accepted) {
            toast({ title: "✅ Propuesta Aceptada", description: `Has iniciado un proyecto con ${users.find(u => u.id === proposal.developer_id)?.name}.` });
          } else {
            toast({ title: "❌ Propuesta Rechazada" });
          }
        }
      };

      const handleDeleteProject = async () => {
        if (!deletingProject) return;
        const { error } = await supabase.from('projects').delete().eq('id', deletingProject.id);
        if (error) {
          toast({ title: "❌ Error al eliminar proyecto", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "🗑️ Proyecto Eliminado" });
        }
        setDeletingProject(null);
      };

      const handleLeaveReview = async (projectId, developerId, rating, comment) => {
        const { error: reviewError } = await supabase.from('reviews').insert([{ project_id: projectId, developer_id: developerId, client_id: currentUser.id, rating, comment }]);
        if (reviewError) {
          toast({ title: "❌ Error", description: "No se pudo enviar la reseña.", variant: "destructive" });
          return;
        }

        const { error: projectError } = await supabase.from('projects').update({ reviewed: true }).eq('id', projectId);
        if (projectError) {
          toast({ title: "❌ Error", description: "No se pudo actualizar el proyecto.", variant: "destructive" });
        } else {
          toast({ title: "⭐ Reseña Enviada", description: "Gracias por tu feedback." });
        }
      };

      const projectProposals = useMemo(() => {
        return proposals.reduce((acc, proposal) => {
          if (!acc[proposal.project_id]) {
            acc[proposal.project_id] = [];
          }
          acc[proposal.project_id].push(proposal);
          return acc;
        }, {});
      }, [proposals]);

      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          <AnimatePresence>
            {(showCreateProject || editingProject) && (
              <CreateProjectForm 
                currentUser={currentUser}
                onClose={() => { setShowCreateProject(false); setEditingProject(null); setTemplateForProject(null); }} 
                onSubmit={handleFormSubmit}
                template={templateForProject}
                projectToEdit={editingProject}
              />
            )}
          </AnimatePresence>
          
          <AlertDialog open={!!deletingProject} onOpenChange={() => setDeletingProject(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto y todas sus propuestas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Panel de Cliente</h1>
            <Button onClick={() => setShowCreateProject(true)}><Plus className="w-4 h-4 mr-2" />Nuevo Proyecto</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <StatCard icon={FolderOpen} title="Proyectos Abiertos" value={myProjects.filter(p => p.status === 'open').length} color="text-blue-500" />
            <StatCard icon={Users} title="Proyectos Activos" value={myProjects.filter(p => p.status === 'in-progress').length} color="text-yellow-500" />
            <StatCard icon={Star} title="Proyectos Completados" value={myProjects.filter(p => p.status === 'completed').length} color="text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">Mis Proyectos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {myProjects.length === 0 ? <p className="text-muted-foreground col-span-2 text-center py-12">No tienes proyectos. ¡Crea uno!</p> : myProjects.map(p => <ProjectCardClient key={p.id} project={p} proposals={projectProposals[p.id] || []} users={users} onProposalResponse={handleProposalResponse} onLeaveReview={handleLeaveReview} onEdit={() => setEditingProject(p)} onDelete={() => setDeletingProject(p)} />)}
          </div>
        </motion.div>
      );
    };

    const StatCard = ({ icon: Icon, title, value, color }) => (
      <motion.div whileHover={{ y: -5 }} className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
          <div className={`p-3 rounded-full bg-primary/5 dark:bg-primary/10 ${color}`}><Icon className="w-6 h-6" /></div>
        </div>
      </motion.div>
    );

    const ProjectCardClient = ({ project, proposals, users, onProposalResponse, onLeaveReview, onEdit, onDelete }) => {
      const [review, setReview] = useState({ rating: 5, comment: '' });
      const [showReview, setShowReview] = useState(false);
      const developer = users.find(u => u.id === project.developer_id);

      const pendingProposals = proposals.filter(p => p.status === 'pending');

      const getStatusInfo = () => {
        switch (project.status) {
          case 'open':
            return {
              className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
              text: 'Abierto',
            };
          case 'in-progress':
            return {
              className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
              text: 'En progreso',
            };
          case 'completed':
            return {
              className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
              text: 'Finalizado',
            };
          default:
            return {
              className: 'bg-gray-100 text-gray-800',
              text: project.status,
            };
        }
      };

      const statusInfo = getStatusInfo();

      return (
        <motion.div layout className="bg-card border rounded-lg p-6 space-y-4 flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{project.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full font-semibold ${statusInfo.className}`}>{statusInfo.text}</span>
          </div>
          <p className="text-sm text-muted-foreground flex-grow">{project.description}</p>
          
          {project.status === 'open' && (
            <>
              {pendingProposals.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Propuestas Recibidas:</p>
                  {pendingProposals.map(prop => {
                    const dev = users.find(u => u.id === prop.developer_id);
                    return (
                      <div key={prop.id} className="bg-secondary p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{dev?.name || 'Desconocido'}</p>
                            <p className="text-green-500 font-bold">${prop.price}</p>
                          </div>
                          <div className="space-x-2">
                            <Button size="icon" className="bg-green-500 hover:bg-green-600 h-8 w-8" onClick={() => onProposalResponse(prop.id, true)}><Check className="w-4 h-4" /></Button>
                            <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => onProposalResponse(prop.id, false)}><X className="w-4 h-4" /></Button>
                          </div>
                        </div>
                        {prop.message && <p className="text-sm text-muted-foreground mt-2 border-t pt-2">{prop.message}</p>}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Esperando propuestas...</p>
              )}
              <div className="flex gap-2 pt-4 border-t border-border/50">
                <Button variant="outline" size="sm" onClick={onEdit} className="w-full"><Edit className="w-4 h-4 mr-2" />Editar</Button>
                <Button variant="destructive" size="sm" onClick={onDelete} className="w-full"><Trash2 className="w-4 h-4 mr-2" />Eliminar</Button>
              </div>
            </>
          )}

          {project.status === 'in-progress' && developer && (
            <>
              <div className="bg-secondary p-3 rounded-md">
                <p className="font-semibold">Dev: {developer.name} - ${project.price}</p>
                {project.delivery_date && <p className="text-sm text-muted-foreground">Entrega: {new Date(project.delivery_date).toLocaleDateString()}</p>}
                <div className="w-full bg-border rounded-full h-2.5 mt-2"><div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div></div>
              </div>
            </>
          )}

           {project.status === 'completed' && (
            <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary p-3 rounded-md">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>¡Proyecto terminado! Contacta al desarrollador para la entrega final.</span>
            </div>
          )}

          {project.status === 'completed' && developer && (
            <div className="mt-4 pt-4 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground mb-1">Contacto del Desarrollador:</p>
                <a href={`mailto:${developer.email}`} className="font-semibold text-primary hover:underline flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    {developer.email}
                </a>
            </div>
           )}
          
          {project.status === 'completed' && (
            <>
              {!project.reviewed && (
                <div className="space-y-2 pt-4 border-t">
                  <Button onClick={() => setShowReview(!showReview)} variant="outline" className="w-full">Dejar Reseña</Button>
                  {showReview && <div className="space-y-2"><div className="flex justify-center">{[1,2,3,4,5].map(i => <Star key={i} onClick={() => setReview({...review, rating: i})} className={`w-6 h-6 cursor-pointer ${i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />)}</div><textarea value={review.comment} onChange={e => setReview({...review, comment: e.target.value})} placeholder="Tu comentario..." className="w-full p-2 bg-background border rounded h-20" /><Button onClick={() => onLeaveReview(project.id, project.developer_id, review.rating, review.comment)} className="w-full">Enviar Reseña</Button></div>}
                </div>
              )}
            </>
          )}
        </motion.div>
      );
    };

    export default ClientDashboard;