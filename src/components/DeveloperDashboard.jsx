
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, Briefcase, Star, ChevronDown, ChevronUp, X, FolderOpen, 
  Calendar, Tag, Palette, Link as LinkIcon, Paperclip, Code, Database, Layers, Cpu, ListChecks, UploadCloud, Info, FileText, CreditCard, Filter, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import PaginationControl from '@/components/PaginationControl';
import CommissionPaymentModal from '@/components/CommissionPaymentModal';

const DeveloperDashboard = ({ currentUser, users, projects, proposals, commissions }) => {
  const [activeTab, setActiveTab] = useState('available');
  const [expandedProjects, setExpandedProjects] = useState({});
  const [proposalModal, setProposalModal] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedProjectForCommission, setSelectedProjectForCommission] = useState(null);
  
  // History Filter States
  const [historyFilter, setHistoryFilter] = useState('all'); // all, paid, pending

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { setCurrentPage(1); }, [activeTab, historyFilter]);

  const myAssignedProjects = useMemo(() => {
    if (!currentUser) return [];
    return projects.filter(p => p.developer_id === currentUser.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [projects, currentUser]);

  const availableProjects = useMemo(() => {
    if (!currentUser) return [];
    return projects.filter(p => p.status === 'open' && !proposals.some(prop => prop.project_id === p.id && prop.developer_id === currentUser.id)).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [projects, proposals, currentUser]);

  // Projects that require commission payment (Completed & Not Paid)
  const pendingCommissions = useMemo(() => {
      return myAssignedProjects.filter(p => p.status === 'completed' && !p.commission_paid).map(p => ({
          ...p,
          is_pending_virtual: true, // Flag to identify it's not in commissions table yet
          commission_amount: (p.price * 0.10).toFixed(2),
          payment_status: 'pending',
          payment_date: null
      }));
  }, [myAssignedProjects]);

  // Actual paid commissions from DB
  const paidCommissions = useMemo(() => {
      return commissions.filter(c => c.developer_id === currentUser.id).map(c => ({
          ...c,
          title: projects.find(p => p.id === c.project_id)?.title || 'Proyecto desconocido',
          price: c.agreed_price
      }));
  }, [commissions, currentUser, projects]);

  // Combined History List
  const combinedHistory = useMemo(() => {
      let list = [...paidCommissions, ...pendingCommissions];
      
      // Sort by date (payment date for paid, created_at/completion for pending)
      list.sort((a, b) => {
          const dateA = a.payment_date || a.completed_at || a.created_at;
          const dateB = b.payment_date || b.completed_at || b.created_at;
          return new Date(dateB) - new Date(dateA);
      });

      if (historyFilter === 'paid') return list.filter(i => i.payment_status === 'paid');
      if (historyFilter === 'pending') return list.filter(i => i.payment_status === 'pending');
      
      return list;
  }, [paidCommissions, pendingCommissions, historyFilter]);

  const currentList = activeTab === 'available' ? availableProjects : activeTab === 'commissions' ? combinedHistory : myAssignedProjects;
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return currentList.slice(start, start + itemsPerPage);
  }, [currentList, currentPage]);

  if (!currentUser) return <div className="text-center p-8">Cargando panel...</div>;
  
  const handleSendProposal = async ({ projectId, price, message }) => {
    const { error } = await supabase.from('proposals').insert([{ project_id: projectId, developer_id: currentUser.id, price: parseFloat(price), message: message, status: 'pending' }]);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Propuesta Enviada" });
      setProposalModal(null);
    }
  };
  
  const handleOpenCommissionPayment = (project) => {
      setSelectedProjectForCommission(project);
      setPaymentModalOpen(true);
  };

  const toggleProjectExpansion = (projectId) => setExpandedProjects(prev => ({ ...prev, [projectId]: !prev[projectId] }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <AnimatePresence>
        {proposalModal && (
          <ProposalModal
            projectTitle={proposalModal.title}
            onClose={() => setProposalModal(null)}
            onSubmit={(data) => handleSendProposal({ ...data, projectId: proposalModal.projectId })}
          />
        )}
        {paymentModalOpen && selectedProjectForCommission && (
            <CommissionPaymentModal 
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                project={selectedProjectForCommission}
                currentUser={currentUser}
            />
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-bold text-foreground mb-6">Panel de Desarrollador</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <StatCard icon={FolderOpen} title="Propuestas Enviadas" value={proposals.filter(p => p.developer_id === currentUser.id).length} color="text-blue-500" />
        <StatCard icon={Briefcase} title="Proyectos Activos" value={myAssignedProjects.filter(p => p.status === 'in-progress').length} color="text-yellow-500" />
        <StatCard icon={Star} title="Comisiones Pendientes" value={pendingCommissions.length} color={pendingCommissions.length > 0 ? "text-red-500" : "text-green-500"} />
      </div>

       <div className="mb-6">
        <div className="flex border-b overflow-x-auto">
          <button onClick={() => setActiveTab('available')} className={`py-2 px-4 font-semibold whitespace-nowrap ${activeTab === 'available' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Proyectos Disponibles</button>
          <button onClick={() => setActiveTab('assigned')} className={`py-2 px-4 font-semibold whitespace-nowrap ${activeTab === 'assigned' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Mis Proyectos</button>
          <button onClick={() => setActiveTab('commissions')} className={`py-2 px-4 font-semibold whitespace-nowrap ${activeTab === 'commissions' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}>Historial de Comisiones</button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {activeTab === 'available' ? (
            <div className="space-y-6">
              {paginatedItems.length === 0 ? <p className="text-muted-foreground text-center py-12">No hay proyectos disponibles.</p> : paginatedItems.map(p => (
                <AvailableProjectCard key={p.id} project={p} users={users} onSendProposal={() => setProposalModal({ projectId: p.id, title: p.title })} isExpanded={!!expandedProjects[p.id]} onToggleExpand={() => toggleProjectExpansion(p.id)} />
              ))}
            </div>
          ) : activeTab === 'commissions' ? (
             <div className="space-y-6">
                {/* Summary Alert for Pendings */}
                {pendingCommissions.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 mb-6">
                        <h3 className="font-bold text-red-600 mb-2 flex items-center gap-2"><CreditCard className="w-5 h-5"/> Tienes pagos pendientes</h3>
                        <p className="text-sm text-muted-foreground mb-4">Para poder tomar nuevos proyectos, debes liquidar las comisiones de los proyectos completados.</p>
                    </div>
                )}

                {/* Toolbar for History */}
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Registro de Transacciones</h3>
                    <div className="flex gap-2">
                        <Button variant={historyFilter === 'all' ? 'secondary' : 'ghost'} size="sm" onClick={() => setHistoryFilter('all')}>Todos</Button>
                        <Button variant={historyFilter === 'paid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setHistoryFilter('paid')} className="text-green-600">Pagados</Button>
                        <Button variant={historyFilter === 'pending' ? 'secondary' : 'ghost'} size="sm" onClick={() => setHistoryFilter('pending')} className="text-red-600">Pendientes</Button>
                    </div>
                </div>

                <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th className="p-4 text-left font-medium text-muted-foreground">Proyecto</th>
                                    <th className="p-4 text-left font-medium text-muted-foreground">Precio Acordado</th>
                                    <th className="p-4 text-left font-medium text-muted-foreground">Comisión (10%)</th>
                                    <th className="p-4 text-left font-medium text-muted-foreground">Fecha</th>
                                    <th className="p-4 text-left font-medium text-muted-foreground">Estado</th>
                                    <th className="p-4 text-right font-medium text-muted-foreground">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No hay registros que coincidan con el filtro.</td></tr>
                                ) : (
                                    paginatedItems.map((item, idx) => (
                                        <tr key={idx} className="border-t border-border/50 hover:bg-secondary/10 transition-colors">
                                            <td className="p-4 font-medium">{item.title}</td>
                                            <td className="p-4">${item.price}</td>
                                            <td className="p-4 font-bold">${item.commission_amount}</td>
                                            <td className="p-4">{item.payment_date ? new Date(item.payment_date).toLocaleDateString() : '-'}</td>
                                            <td className="p-4">
                                                {item.payment_status === 'paid' ? (
                                                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20">Pagado</Badge>
                                                ) : (
                                                    <Badge variant="destructive">Pendiente</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                {item.payment_status === 'pending' && (
                                                    <Button size="sm" onClick={() => handleOpenCommissionPayment(item)}>Pagar Ahora</Button>
                                                )}
                                                {item.payment_status === 'paid' && (
                                                    <span className="text-xs text-muted-foreground">Ver recibo</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
          ) : (
            <div className="space-y-6">
                {paginatedItems.length === 0 ? <p className="text-muted-foreground text-center py-12">No tienes proyectos asignados.</p> : paginatedItems.map(p => (
                    <AssignedProjectCard 
                        key={p.id} 
                        project={p} 
                        client={users.find(u => u.id === p.client_id)} 
                        currentUser={currentUser} 
                        pendingCommission={!p.commission_paid && p.status === 'completed'}
                        onPayCommission={() => handleOpenCommissionPayment(p)}
                    />
                ))}
            </div>
          )}
          <PaginationControl currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex justify-between items-center">
    <div><p className="text-muted-foreground text-sm font-medium">{title}</p><p className={`text-3xl font-bold ${color}`}>{value}</p></div>
    <div className={`p-3 rounded-full bg-primary/5 ${color}`}><Icon className="w-6 h-6" /></div>
  </div>
);

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3"><Icon className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" /><div><p className="font-semibold text-sm">{label}</p><p className="text-sm text-muted-foreground">{value}</p></div></div>
);

const AvailableProjectCard = ({ project, users, onSendProposal, isExpanded, onToggleExpand }) => {
    const client = users.find(u => u.id === project.client_id);
    return (
    <motion.div layout className="bg-card border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div><h3 className="font-bold text-lg">{project.title}</h3><p className="text-sm text-muted-foreground">Cliente: {client?.name}</p></div>
        <Button variant="ghost" size="sm" onClick={onToggleExpand}>Ver detalles {isExpanded ? <ChevronUp /> : <ChevronDown />}</Button>
      </div>
      <AnimatePresence>{isExpanded && (<motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="overflow-hidden border-t pt-4"><p className="text-sm whitespace-pre-wrap">{project.description}</p><div className="grid grid-cols-2 gap-4 mt-4"><DetailItem icon={DollarSign} label="Presupuesto" value={`$${project.budget}`} /><DetailItem icon={Calendar} label="Límite" value={project.deadline} /></div></motion.div>)}</AnimatePresence>
      <div className="pt-4 border-t"><Button onClick={onSendProposal} className="w-full">Enviar Propuesta</Button></div>
    </motion.div>
  );
};

const AssignedProjectCard = ({ project, client, currentUser, pendingCommission, onPayCommission }) => {
    const [progress, setProgress] = useState(project.progress || 0);
    const [updateDescription, setUpdateDescription] = useState('');
    const [isDetailsOpen, setIsDetailsOpen] = useState(true); 
    const fileInputRef = useRef(null);
    const [attachments, setAttachments] = useState([]);

    useEffect(() => { setProgress(project.progress || 0); }, [project.progress]);
    
    const submitUpdate = async () => {
        if (!updateDescription.trim()) return toast({ title: 'Descripción requerida', variant: 'destructive' });
        const { error } = await supabase.from('project_updates').insert({ project_id: project.id, developer_id: currentUser.id, description: updateDescription, progress_percentage: progress, attachments });
        if (!error) { await supabase.from('projects').update({ progress }).eq('id', project.id); toast({ title: 'Avance guardado' }); setUpdateDescription(''); setAttachments([]); }
    };

    const handleFileUpload = async (e) => {
        toast({ title: "Archivos listos para subir" });
    };

    return (
        <div className={`bg-card border rounded-lg p-6 space-y-4 shadow-sm ${pendingCommission ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}>
            <div className="flex justify-between items-start">
                <div><h3 className="font-bold text-lg">{project.title}</h3><p className="text-sm text-muted-foreground">Cliente: {client?.name}</p></div>
                <div className="flex flex-col items-end gap-2">
                    <Badge variant={project.status === 'completed' ? 'success' : 'warning'}>{project.status}</Badge>
                    {pendingCommission && <Badge variant="destructive" className="animate-pulse">Pago de Comisión Pendiente</Badge>}
                </div>
            </div>
            
            {pendingCommission && (
                <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20 flex justify-between items-center">
                    <div>
                         <p className="text-sm font-bold text-red-600">¡Proyecto Completado!</p>
                         <p className="text-xs text-muted-foreground">Debes abonar la comisión del 10% (${(project.price * 0.1).toFixed(2)}) para liberar tu cuenta.</p>
                    </div>
                    <Button size="sm" variant="destructive" onClick={onPayCommission}>Pagar Comisión</Button>
                </div>
            )}

            <div className="bg-secondary/20 border border-border/50 rounded-lg overflow-hidden">
                <button onClick={() => setIsDetailsOpen(!isDetailsOpen)} className="flex items-center justify-between w-full p-3 text-sm font-semibold hover:bg-secondary/40">
                    <span className="flex items-center gap-2"><Info className="w-4 h-4" /> Detalles del Proyecto</span>{isDetailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                    {isDetailsOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-border/50 p-4 text-sm space-y-3 bg-background/50">
                            <div><span className="font-bold text-xs uppercase text-muted-foreground">Descripción</span><p className="mt-1">{project.description}</p></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><span className="font-bold text-xs uppercase text-muted-foreground">Objetivos/Requerimientos</span><ul className="list-disc pl-4 mt-1">{project.features?.map((f,i)=><li key={i}>{f}</li>)}</ul></div>
                                <div className="space-y-2">
                                    <div><span className="font-bold text-xs uppercase text-muted-foreground">Fecha Entrega</span><p>{project.delivery_date}</p></div>
                                    <div><span className="font-bold text-xs uppercase text-muted-foreground">Estado</span><p>{project.status} ({project.progress}%)</p></div>
                                </div>
                            </div>
                            {project.comments && <div><span className="font-bold text-xs uppercase text-muted-foreground">Notas del Cliente</span><p className="italic bg-yellow-500/10 p-2 rounded">{project.comments}</p></div>}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {project.status !== 'completed' && (
                <div className="space-y-4 border-t pt-4">
                    <div className="flex justify-between text-sm font-medium"><span>Nuevo Progreso</span><span>{progress}%</span></div>
                    <Slider value={[progress]} max={100} onValueChange={(val) => setProgress(val[0])} />
                    <textarea placeholder="Descripción del avance..." value={updateDescription} onChange={e => setUpdateDescription(e.target.value)} className="w-full p-3 bg-background border rounded-md h-24 resize-none" />
                    <div className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current.click()}><UploadCloud className="w-4 h-4 mr-2"/> Adjuntar</Button>
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} multiple />
                        <Button onClick={submitUpdate}>Guardar Avance</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProposalModal = ({ projectTitle, onClose, onSubmit }) => {
  const [price, setPrice] = useState(''); const [message, setMessage] = useState('');
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md space-y-4">
        <h3 className="font-bold text-lg">Propuesta para {projectTitle}</h3>
        <input type="number" placeholder="Precio" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border rounded" />
        <textarea placeholder="Mensaje" value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 border rounded h-24" />
        <div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button onClick={() => onSubmit({ price, message })}>Enviar</Button></div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
