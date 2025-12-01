
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertOctagon, MessageSquare, User, Calendar, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectDetailsModal from '@/components/ProjectDetailsModal';
import ChatWidget from '@/components/ChatWidget';
import { differenceInCalendarDays } from 'date-fns';

const MonitoringPage = ({ projects, users, currentUser, messages, projectUpdates }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [forceChatOpen, setForceChatOpen] = useState(null);

  // Logic 1: Automatic Detection in Real-Time
  const monitoringData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const risk = [];
    const overdue = [];

    projects.forEach(p => {
      if (p.status === 'completed') return;
      const deliveryDate = p.delivery_date ? new Date(p.delivery_date) : null;
      if (!deliveryDate) return;

      const daysLeft = differenceInCalendarDays(deliveryDate, today);

      // Overdue: Date passed AND progress < 100%
      if (deliveryDate < today && p.progress < 100) {
        overdue.push({ ...p, daysLeft });
        return;
      }

      // Risk: <= 5 days AND progress < 90%
      if (daysLeft <= 5 && p.progress < 90) {
        risk.push({ ...p, daysLeft });
      }
    });

    return { risk, overdue };
  }, [projects]);

  const getLastUpdate = (projectId) => {
    if (!projectUpdates) return null;
    const updates = projectUpdates.filter(u => u.project_id === projectId);
    if (updates.length === 0) return null;
    return updates.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h1 className="text-3xl font-bold text-foreground mb-6">Centro de Monitoreo</h1>

      {/* Section 1: Projects in Risk */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-orange-500 flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6" /> Proyectos en Riesgo ({monitoringData.risk.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monitoringData.risk.length === 0 && <p className="text-muted-foreground italic col-span-full">No hay proyectos en riesgo.</p>}
            {monitoringData.risk.map(p => (
            <MonitoringCard 
                key={p.id} 
                project={p} 
                type="risk" 
                users={users} 
                lastUpdate={getLastUpdate(p.id)}
                onOpenChat={() => setForceChatOpen({ projectId: p.id, type: 'risk' })}
                onViewDetails={() => setSelectedProject(p)}
            />
            ))}
        </div>
      </div>

      {/* Section 2: Overdue Projects */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-red-600 flex items-center gap-2 mb-4">
            <AlertOctagon className="w-6 h-6" /> Proyectos Vencidos ({monitoringData.overdue.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monitoringData.overdue.length === 0 && <p className="text-muted-foreground italic col-span-full">No hay proyectos vencidos.</p>}
            {monitoringData.overdue.map(p => (
            <MonitoringCard 
                key={p.id} 
                project={p} 
                type="overdue" 
                users={users} 
                lastUpdate={getLastUpdate(p.id)}
                onOpenChat={() => setForceChatOpen({ projectId: p.id, type: 'overdue' })}
                onViewDetails={() => setSelectedProject(p)}
            />
            ))}
        </div>
      </div>

      {selectedProject && <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} currentUser={currentUser} />}

      {/* Logic 2: Automatic Chat Creation context passing */}
      {forceChatOpen && (
        <div className="fixed bottom-0 right-0 z-50 pointer-events-none">
           <div className="pointer-events-auto">
              <ChatWidget 
                  currentUser={currentUser} 
                  users={users} 
                  projects={projects} 
                  messages={messages}
                  forcedOpenProjectId={forceChatOpen.projectId}
                  forcedContextLabel={forceChatOpen.type === 'risk' ? 'Chat de Riesgo' : 'Chat de Proyecto Vencido'}
              />
           </div>
        </div>
      )}
    </motion.div>
  );
};

const MonitoringCard = ({ project, type, users, lastUpdate, onOpenChat, onViewDetails }) => {
  const client = users.find(u => u.id === project.client_id);
  const dev = users.find(u => u.id === project.developer_id);
  const isRisk = type === 'risk';

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`border rounded-xl p-6 shadow-lg flex flex-col justify-between relative overflow-hidden min-h-[280px]
        ${isRisk ? 'bg-orange-950/40 border-orange-900/50' : 'bg-red-950/40 border-red-900/50'}
      `}
    >
      <div className="absolute top-4 right-4">
          {isRisk ? <AlertTriangle className="w-6 h-6 text-orange-500 animate-pulse" /> : <AlertOctagon className="w-6 h-6 text-red-500 animate-pulse" />}
      </div>

      <div className="space-y-3 z-10">
        <h3 className="font-bold text-lg text-white truncate pr-8" title={project.title}>{project.title}</h3>
        
        <div className="space-y-1 text-sm text-gray-300">
           <p><span className="opacity-70">Cliente:</span> <span className="font-medium text-white">{client?.name || 'N/A'}</span></p>
           <p><span className="opacity-70">Desarrollador:</span> <span className="font-medium text-white">{dev?.name || 'N/A'}</span></p>
           
           <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-2">
               <span className="font-medium">Progreso:</span>
               <span className={`font-bold ${isRisk ? 'text-orange-400' : 'text-red-400'}`}>{project.progress}%</span>
           </div>

           <div className="flex justify-between items-center">
               <span className="font-medium">Entrega:</span>
               <span>{new Date(project.delivery_date).toLocaleDateString()}</span>
           </div>
            
           <div className="flex justify-between items-center text-xs font-semibold">
               <span>Días Restantes:</span>
               <span className={project.daysLeft < 0 ? 'text-red-400' : 'text-white'}>{project.daysLeft} días</span>
           </div>

           {lastUpdate && (
             <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-white/10">
               <span className="font-semibold">Último avance:</span> {new Date(lastUpdate.created_at).toLocaleDateString()}
             </div>
           )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 z-10">
        <Button variant="secondary" className="w-full text-xs h-9" onClick={onViewDetails}>Ver Detalles</Button>
        <Button 
            className={`w-full text-white border-none font-medium text-xs h-9 flex items-center gap-2 justify-center
                ${isRisk ? 'bg-orange-700 hover:bg-orange-800' : 'bg-red-700 hover:bg-red-800'}
            `}
            onClick={onOpenChat}
        >
            <MessageSquare className="w-3 h-3" /> Abrir Chat
        </Button>
      </div>
      
      <div className={`absolute inset-0 bg-gradient-to-br pointer-events-none opacity-20 ${isRisk ? 'from-orange-900 to-transparent' : 'from-red-900 to-transparent'}`} />
    </motion.div>
  );
};

export default MonitoringPage;
