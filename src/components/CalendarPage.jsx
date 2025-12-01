
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';
import Calendar from '@/components/Calendar';
import ProjectDetailsModal from '@/components/ProjectDetailsModal';
import ProjectUpdateDetailsModal from '@/components/ProjectUpdateDetailsModal';
import { parseISO, subDays, isSameDay, startOfDay, differenceInCalendarDays } from 'date-fns';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const CalendarPage = ({ projects, currentUser, projectUpdates, users }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const { toast } = useToast();

  const fetchPersonalEvents = async () => {
    if (!currentUser) return;
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', currentUser.id);
    
    if (error) {
      console.error('Error fetching calendar events:', error);
    } else {
      return data.map(e => ({
        ...e,
        date: parseISO(e.date),
        isProject: false
      }));
    }
    return [];
  };

  useEffect(() => {
    const loadEvents = async () => {
      const personalEvents = await fetchPersonalEvents();
      const generatedEvents = [];
      const today = startOfDay(new Date());
      
      projects.forEach(project => {
        const isRelevant = 
          project.developer_id === currentUser?.id || 
          project.client_id === currentUser?.id || 
          currentUser?.role === 'admin';
        
        if (isRelevant && project.delivery_date && project.status !== 'completed') {
          const deliveryDate = parseISO(project.delivery_date);
          const daysLeft = differenceInCalendarDays(deliveryDate, today);
          
          // Logic 1: Detection
          const isRisk = daysLeft <= 5 && daysLeft >= 0 && project.progress < 90;
          const isOverdue = deliveryDate < today && project.progress < 100;

          // Base Delivery Event
          generatedEvents.push({
            id: `delivery-${project.id}`,
            title: `📦 Entrega: ${project.title}`,
            description: `Progreso: ${project.progress}%`,
            date: deliveryDate,
            color: isOverdue ? 'bg-red-500/20' : 'bg-indigo-500/20',
            borderColor: isOverdue ? 'border-red-500' : 'border-indigo-500',
            isProject: true,
            type: 'delivery',
            projectData: project,
          });

          // Logic 4: Calendar Tags
          
          // RISK TAG: "⛔ Este proyecto está en Riesgo..." (Dev & Admin)
          if (isRisk && (currentUser.role === 'developer' || currentUser.role === 'admin')) {
            generatedEvents.push({
              id: `risk-${project.id}`,
              title: `⛔ Riesgo: ${project.title}`,
              description: "Este proyecto está en Riesgo, el Admin se ha puesto en contacto contigo.",
              date: today, // Show on current day
              color: 'bg-orange-500/40',
              borderColor: 'border-orange-600',
              isProject: true,
              type: 'risk_alert',
              projectData: project,
            });
          }

          // OVERDUE TAG: "❗ Este proyecto está Vencido..." (Client, Dev, Admin)
          if (isOverdue) {
             // Show to all involved
             generatedEvents.push({
                id: `overdue-${project.id}`,
                title: `❗ Vencido: ${project.title}`,
                description: "Este proyecto está Vencido. Revisa el chat con el Admin.",
                date: today, // Show on current day
                color: 'bg-red-600/40',
                borderColor: 'border-red-700',
                isProject: true,
                type: 'overdue_alert',
                projectData: project,
             });
          }
        }
      });

      if (projectUpdates) {
        projectUpdates.forEach(update => {
           // ... (Update events logic remains same)
           const project = projects.find(p => p.id === update.project_id);
           const isRelevant = project && (project.developer_id === currentUser?.id || project.client_id === currentUser?.id || currentUser?.role === 'admin');
           if (isRelevant) {
             generatedEvents.push({
               id: `update-${update.id}`,
               title: `📈 Avance: ${project.title} (${update.progress_percentage}%)`,
               description: update.description,
               date: parseISO(update.created_at),
               color: 'bg-green-500/20',
               borderColor: 'border-green-500',
               isProject: true,
               type: 'update',
               updateData: update,
             });
           }
        });
      }

      setCalendarEvents([...generatedEvents, ...(personalEvents || [])]);
    };

    loadEvents();
  }, [projects, currentUser, projectUpdates]);

  const handleEventClick = (event) => {
    if (event.type === 'update' && event.updateData) {
      setSelectedUpdate(event.updateData);
    } else if (event.isProject && event.projectData) {
      setSelectedProject(event.projectData);
    }
  };

  const handleSavePersonalEvent = async (newEvent) => {
      const { data, error } = await supabase.from('calendar_events').insert({
          user_id: currentUser.id,
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date.toISOString(),
          status: newEvent.status,
          color: newEvent.color,
          type: 'personal'
      }).select().single();

      if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
          toast({ title: "Evento guardado" });
          setCalendarEvents(prev => [...prev, { ...data, date: parseISO(data.date), isProject: false }]);
      }
  };
  
  const handleDeletePersonalEvent = async (eventId) => {
      if (!eventId || String(eventId).startsWith('task-')) return;
      const { error } = await supabase.from('calendar_events').delete().eq('id', eventId);
      if (!error) {
           toast({ title: "Evento eliminado" });
           setCalendarEvents(prev => prev.filter(e => e.id !== eventId));
      }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg text-primary-foreground"><CalendarIcon className="w-6 h-6" /></div>
          <h2 className="text-2xl font-bold">Calendario {currentUser?.role === 'admin' ? 'Global' : 'Personal'}</h2>
        </div>
      </div>
      <div className="bg-card rounded-lg p-6 border border-border shadow-lg">
        <Calendar 
          events={calendarEvents} 
          setEvents={setCalendarEvents}
          currentUser={currentUser}
          onEventClick={handleEventClick}
          onSaveEvent={handleSavePersonalEvent}
          onDeleteEvent={handleDeletePersonalEvent}
        />
      </div>
      {selectedProject && <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} currentUser={currentUser} />}
      {selectedUpdate && <ProjectUpdateDetailsModal update={selectedUpdate} onClose={() => setSelectedUpdate(null)} users={users} />}
    </motion.div>
  );
};

export default CalendarPage;
