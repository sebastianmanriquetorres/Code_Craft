
import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, Clock, CheckCircle, User, History } from 'lucide-react';
import PaginationControl from '@/components/PaginationControl';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/customSupabaseClient';

const ProjectsPage = ({ users, projects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedHistoryProject, setSelectedHistoryProject] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const itemsPerPage = 10;

  const getBusinessDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    let count = 0;
    const curDate = new Date(startDate.getTime());
    const end = new Date(endDate);
    while (curDate <= end) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  };

  const isAtRisk = (project) => {
      if (!project.delivery_date || project.status === 'completed' || project.progress >= 90) return false;
      const days = getBusinessDays(new Date(), new Date(project.delivery_date));
      // MODIFIED: Risk threshold changed to 7 days
      return days <= 7;
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter(p => {
        const client = users.find(u => u.id === p.client_id);
        const developer = users.find(u => u.id === p.developer_id);
        const search = searchTerm.toLowerCase();
        
        const matchesSearch = (
          p.title.toLowerCase().includes(search) ||
          client?.name.toLowerCase().includes(search) ||
          client?.email.toLowerCase().includes(search) ||
          developer?.name.toLowerCase().includes(search) ||
          developer?.email.toLowerCase().includes(search)
        );

        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchesRisk = riskFilter ? isAtRisk(p) : true;

        return matchesSearch && matchesStatus && matchesRisk;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [projects, users, searchTerm, statusFilter, riskFilter]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusInfo = (project) => {
    if (isAtRisk(project)) return { text: 'En Riesgo', color: 'bg-destructive/10 text-destructive border-destructive/20' };
    switch (project.status) {
      case 'open': return { text: 'Abierto', color: 'bg-blue-500/20 text-blue-400' };
      case 'in-progress': return { text: 'En Progreso', color: 'bg-yellow-500/20 text-yellow-400' };
      case 'completed': return { text: project.paid ? 'Pagado' : 'Listo para Pagar', color: project.paid ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400' };
      default: return { text: project.status, color: 'bg-gray-500/20 text-gray-400' };
    }
  };

  const handleViewHistory = async (project) => {
      setSelectedHistoryProject(project);
      // In a real scenario, we would fetch from 'project_history' table
      // Since we just created the table, it might be empty, so we'll also show some synthetic logs based on project data
      const { data } = await supabase.from('project_history').select('*').eq('project_id', project.id).order('created_at', { ascending: false });
      
      let logs = data || [];
      if (logs.length === 0) {
          // Synthetic history for UX demonstration if empty
          logs = [
              { id: 'syn1', action_type: 'creation', description: 'Proyecto creado', created_at: project.created_at },
              ...(project.completed_at ? [{ id: 'syn2', action_type: 'completion', description: 'Proyecto completado', created_at: project.completed_at }] : [])
          ];
      }
      setHistoryLogs(logs);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h1 className="text-3xl font-bold text-foreground mb-6">Vista Global de Proyectos</h1>
      
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar por proyecto, cliente o desarrollador..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-card border rounded-md p-1">
          <Button variant={statusFilter === 'all' && !riskFilter ? 'secondary' : 'ghost'} size="sm" onClick={() => { setStatusFilter('all'); setRiskFilter(false); setCurrentPage(1); }}>Todos</Button>
          <Button variant={statusFilter === 'open' ? 'secondary' : 'ghost'} size="sm" onClick={() => { setStatusFilter('open'); setRiskFilter(false); setCurrentPage(1); }}>Abiertos</Button>
          <Button variant={statusFilter === 'in-progress' ? 'secondary' : 'ghost'} size="sm" onClick={() => { setStatusFilter('in-progress'); setRiskFilter(false); setCurrentPage(1); }}>En Progreso</Button>
          <Button variant={statusFilter === 'completed' ? 'secondary' : 'ghost'} size="sm" onClick={() => { setStatusFilter('completed'); setRiskFilter(false); setCurrentPage(1); }}>Completados</Button>
          <Button variant={riskFilter ? 'destructive' : 'ghost'} size="sm" onClick={() => { setRiskFilter(!riskFilter); setStatusFilter('all'); setCurrentPage(1); }}>
             <AlertTriangle className="w-4 h-4 mr-1"/> En Riesgo
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProjects.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-12">No se encontraron proyectos con los filtros actuales.</p>
        ) : (
          paginatedProjects.map(p => {
            const client = users.find(u => u.id === p.client_id);
            const developer = users.find(u => u.id === p.developer_id);
            const statusInfo = getStatusInfo(p);
            const atRisk = isAtRisk(p);

            return (
              <motion.div key={p.id} layout className={`bg-card border rounded-lg p-6 space-y-4 relative ${atRisk ? 'border-destructive shadow-sm shadow-destructive/20' : ''}`}>
                {atRisk && <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-bold shadow-sm animate-pulse">¡EN RIESGO!</div>}
                
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg truncate w-3/4" title={p.title}>{p.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold border ${statusInfo.color}`}>{statusInfo.text}</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2 text-sm">
                    {client && <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground"/> <span className="text-muted-foreground">Cliente:</span> {client.name}</div>}
                    {developer && <div className="flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground"/> <span className="text-muted-foreground">Dev:</span> {developer.name}</div>}
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Progreso</span>
                    <span className={`font-bold ${atRisk ? 'text-destructive' : ''}`}>{p.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${atRisk ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${p.progress || 0}%` }}></div>
                  </div>
                </div>

                {p.delivery_date && (
                  <p className={`text-sm flex items-center gap-2 ${atRisk ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                    <Clock className="w-4 h-4"/>
                    <span>Entrega: {new Date(p.delivery_date).toLocaleDateString()}</span>
                  </p>
                )}
                
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewHistory(p)}>
                    <History className="w-4 h-4 mr-2"/> Ver Historial
                </Button>
              </motion.div>
            );
          })
        )}
      </div>
      <PaginationControl currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <Dialog open={!!selectedHistoryProject} onOpenChange={() => setSelectedHistoryProject(null)}>
          <DialogContent>
              <DialogHeader><DialogTitle>Historial: {selectedHistoryProject?.title}</DialogTitle></DialogHeader>
              <div className="relative border-l border-muted ml-4 space-y-6 py-4">
                  {historyLogs.length === 0 ? <p className="text-sm text-muted-foreground pl-4">No hay historial disponible.</p> : historyLogs.map((log, idx) => (
                      <div key={idx} className="relative pl-6">
                          <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-primary"></span>
                          <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                          <p className="text-sm font-semibold">{log.description}</p>
                          {log.action_type && <span className="text-[10px] uppercase tracking-wider bg-secondary px-1 rounded text-secondary-foreground">{log.action_type}</span>}
                      </div>
                  ))}
              </div>
          </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProjectsPage;
