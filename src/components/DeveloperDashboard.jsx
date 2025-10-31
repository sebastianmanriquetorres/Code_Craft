
    import React, { useState, useMemo, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { DollarSign, Briefcase, Star, ChevronDown, ChevronUp, X, FolderOpen } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { toast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/customSupabaseClient';
    import { Slider } from "@/components/ui/slider";

    const DeveloperDashboard = ({ currentUser, users, projects, proposals }) => {
      const [activeTab, setActiveTab] = useState('available');
      const [expandedProjects, setExpandedProjects] = useState({});
      const [proposalModal, setProposalModal] = useState(null);

      const myAssignedProjects = useMemo(() => projects.filter(p => p.developer_id === currentUser.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), [projects, currentUser.id]);
      const availableProjects = useMemo(() => projects.filter(p => p.status === 'open' && !proposals.some(prop => prop.project_id === p.id && prop.developer_id === currentUser.id)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)), [projects, proposals, currentUser.id]);

      const handleSendProposal = async ({ projectId, price, message }) => {
        if (!price || price <= 0) {
          toast({ title: "❌ Precio inválido", variant: "destructive" });
          return;
        }
        const { error } = await supabase.from('proposals').insert([{ project_id: projectId, developer_id: currentUser.id, price: parseFloat(price), message: message, status: 'pending' }]);
        if (error) {
          toast({ title: "❌ Error al enviar propuesta", description: error.code === '23505' ? "Ya enviaste una propuesta para este proyecto." : error.message, variant: "destructive" });
        } else {
          toast({ title: "✅ Propuesta Enviada" });
          setProposalModal(null);
        }
      };

      const toggleProjectExpansion = (projectId) => {
        setExpandedProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));
      };

      return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          <AnimatePresence>
            {proposalModal && (
              <ProposalModal
                projectTitle={proposalModal.title}
                onClose={() => setProposalModal(null)}
                onSubmit={(data) => handleSendProposal({ ...data, projectId: proposalModal.projectId })}
              />
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Panel de Desarrollador</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <StatCard icon={FolderOpen} title="Propuestas Enviadas" value={proposals.filter(p => p.developer_id === currentUser.id).length} color="text-blue-500" />
            <StatCard icon={Briefcase} title="Proyectos Activos" value={myAssignedProjects.filter(p => p.status === 'in-progress').length} color="text-yellow-500" />
            <StatCard icon={Star} title="Proyectos Completados" value={myAssignedProjects.filter(p => p.status === 'completed').length} color="text-green-500" />
          </div>

           <div className="mb-6">
            <div className="flex border-b">
              <button onClick={() => setActiveTab('available')} className={`py-2 px-4 font-semibold ${activeTab === 'available' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Proyectos Disponibles</button>
              <button onClick={() => setActiveTab('assigned')} className={`py-2 px-4 font-semibold ${activeTab === 'assigned' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Mis Proyectos</button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {activeTab === 'available' ? (
                <div className="space-y-6">
                  {availableProjects.length === 0 ? <p className="text-muted-foreground text-center py-12">No hay proyectos disponibles o ya has enviado una propuesta a todos.</p> : availableProjects.map(p => (
                    <AvailableProjectCard key={p.id} project={p} users={users} onSendProposal={() => setProposalModal({ projectId: p.id, title: p.title })} isExpanded={!!expandedProjects[p.id]} onToggleExpand={() => toggleProjectExpansion(p.id)} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                    {myAssignedProjects.length === 0 ? <p className="text-muted-foreground text-center py-12">No tienes proyectos asignados.</p> : myAssignedProjects.map(p => <AssignedProjectCard key={p.id} project={p} client={users.find(u => u.id === p.client_id)} />)}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
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

    const DetailItem = ({ icon: Icon, label, value }) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return null;
      return (
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 text-muted-foreground mt-1" />
          <div>
            <p className="font-semibold text-sm">{label}</p>
            <p className="text-sm text-muted-foreground">{Array.isArray(value) ? value.join(', ') : value}</p>
          </div>
        </div>
      );
    };

    const AvailableProjectCard = ({ project, users, onSendProposal, isExpanded, onToggleExpand }) => {
      const client = users.find(u => u.id === project.client_id);
      return (
        <motion.div layout className="bg-card border rounded-lg p-6 space-y-4 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{project.title}</h3>
              <p className="text-sm text-muted-foreground">Cliente: {client?.name}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggleExpand}>Ver detalles {isExpanded ? <ChevronUp /> : <ChevronDown />}</Button>
          </div>
          <p className="text-sm">{project.description.substring(0, 150)}{project.description.length > 150 ? '...' : ''}</p>
          <AnimatePresence>
            {isExpanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="border-t pt-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem icon={DollarSign} label="Presupuesto (USD)" value={project.budget ? `$${project.budget}` : 'No especificado'} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="pt-4 border-t">
            <Button onClick={onSendProposal} className="w-full">Enviar Propuesta</Button>
          </div>
        </motion.div>
      );
    };

    const AssignedProjectCard = ({ project, client }) => {
        const [progress, setProgress] = useState(project.progress || 0);
        const [deliveryDate, setDeliveryDate] = useState(project.delivery_date ? project.delivery_date.split('T')[0] : '');
        const [deliveryDescription, setDeliveryDescription] = useState(project.delivery_description || '');

        useEffect(() => {
          setProgress(project.progress || 0);
          setDeliveryDate(project.delivery_date ? project.delivery_date.split('T')[0] : '');
          setDeliveryDescription(project.delivery_description || '');
        }, [project.progress, project.delivery_date, project.delivery_description]);

        const handleProgressChange = (newProgress) => {
            setProgress(newProgress[0]);
        };
        
        const updateProjectDetails = async () => {
            const { error } = await supabase.from('projects')
                .update({ 
                    progress: progress, 
                    delivery_date: deliveryDate || null, 
                    delivery_description: deliveryDescription,
                    ...(progress === 100 && { status: 'completed' }) 
                })
                .eq('id', project.id);
            if (error) {
                toast({ title: 'Error al actualizar', description: error.message, variant: 'destructive' });
            } else {
                toast({ title: 'Proyecto actualizado' });
            }
        };

        return (
            <motion.div layout className="bg-card border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">Cliente: {client?.name} - <span className="font-bold text-green-500">${project.price}</span></p>
                    </div>
                     <span className={`px-2 py-1 text-xs rounded-full font-semibold ${project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{project.status === 'completed' ? 'Finalizado' : 'En Progreso'}</span>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Progreso: {progress}%</label>
                    <Slider value={[progress]} max={100} step={1} onValueChange={handleProgressChange} disabled={project.status === 'completed'} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Fecha de Entrega</label>
                        <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="w-full p-2 bg-background border rounded" disabled={project.status === 'completed'} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Descripción de Entrega</label>
                        <input type="text" placeholder="Ej: Entrega del módulo inicial" value={deliveryDescription} onChange={e => setDeliveryDescription(e.target.value)} className="w-full p-2 bg-background border rounded" disabled={project.status === 'completed'} />
                    </div>
                </div>

                <Button onClick={updateProjectDetails} className="w-full" disabled={project.status === 'completed'}>Guardar Cambios</Button>

            </motion.div>
        );
    };

    const ProposalModal = ({ projectTitle, onClose, onSubmit }) => {
      const [price, setPrice] = useState('');
      const [message, setMessage] = useState('');
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="bg-card rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Enviar Propuesta</h3><Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button></div>
            <p className="text-muted-foreground mb-4">Para: <span className="font-semibold text-foreground">{projectTitle}</span></p>
            <form onSubmit={(e) => { e.preventDefault(); onSubmit({ price, message }); }} className="space-y-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Tu Oferta (USD)</label>
                <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" /><input id="price" type="number" placeholder="500" value={price} onChange={e => setPrice(e.target.value)} className="w-full pl-9 p-2 bg-background border rounded-md" required /></div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Mensaje</label>
                <textarea id="message" placeholder="¿Por qué eres el mejor para este proyecto?" value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 bg-background border rounded-md h-28"/>
              </div>
              <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button><Button type="submit">Enviar</Button></div>
            </form>
          </motion.div>
        </motion.div>
      );
    };

    export default DeveloperDashboard;
  