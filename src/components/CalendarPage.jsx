
import React from 'react';
import { motion } from 'framer-motion';
import Calendar from '@/components/Calendar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';

const CalendarPage = ({ projects, currentUser }) => {
  const [calendarTasks, setCalendarTasks] = useLocalStorage('calendarTasks', []);

  const projectEvents = projects
    .filter(p => p.delivery_date && (p.client_id === currentUser.id || p.developer_id === currentUser.id))
    .map(p => ({
      id: `proj-${p.id}`,
      title: p.title,
      date: new Date(p.delivery_date),
      color: 'green',
      isProject: true,
      description: p.delivery_description || 'Entrega del proyecto.'
    }));

  const handleSetEvents = async (newEvents) => {
    const tasks = newEvents.filter(e => !e.isProject);
    const projectUpdates = newEvents.filter(e => e.isProject);

    setCalendarTasks(tasks);

    if (currentUser.role === 'developer') {
      for (const event of projectUpdates) {
        const projectId = event.id.replace('proj-', '');
        const { error } = await supabase
          .from('projects')
          .update({ delivery_date: event.date.toISOString().split('T')[0] })
          .eq('id', projectId);
        
        if (error) {
          toast({ title: "Error al actualizar fecha", variant: "destructive" });
        }
      }
    }
  };

  const allEvents = [...projectEvents, ...calendarTasks.map(t => ({...t, date: new Date(t.date)}))];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h1 className="text-3xl font-bold text-foreground mb-6">Calendario de Proyectos</h1>
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <Calendar events={allEvents} setEvents={handleSetEvents} currentUser={currentUser} />
      </div>
    </motion.div>
  );
};

export default CalendarPage;
