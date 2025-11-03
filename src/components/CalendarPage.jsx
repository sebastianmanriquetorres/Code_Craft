import React, { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Calendar from '@/components/Calendar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const CalendarPage = ({ projects, currentUser }) => {
  const { user } = useAuth();
  // Ensure we have a stable key for local storage
  const storageKey = user ? `calendarTasks_${user.id}` : null;
  const [calendarTasks, setCalendarTasks] = useLocalStorage(storageKey, []);

  // Effect to clear tasks if user logs out
  useEffect(() => {
    if (!user) {
      setCalendarTasks([]);
    }
  }, [user, setCalendarTasks]);

  const projectEvents = projects
    .filter(p => p.delivery_date && (p.client_id === currentUser.id || p.developer_id === currentUser.id))
    .map(p => ({
      id: `proj-${p.id}`,
      title: p.title,
      date: new Date(p.delivery_date + 'T00:00:00'),
      color: 'green',
      isProject: true,
      description: p.delivery_description || 'Entrega del proyecto.'
    }));

  const handleSetEvents = useCallback(async (newEvents) => {
    if (!storageKey) return; // Don't save if there's no user

    const tasks = newEvents.filter(e => !e.isProject);
    const projectUpdates = newEvents.filter(e => e.isProject);

    setCalendarTasks(tasks);

    if (currentUser.role === 'developer') {
      const changedProjects = projectUpdates.filter(event => {
        const originalEvent = projectEvents.find(orig => orig.id === event.id);
        if (!originalEvent) return false;
        const newDate = new Date(event.date).setHours(0, 0, 0, 0);
        const originalDate = new Date(originalEvent.date).setHours(0, 0, 0, 0);
        return newDate !== originalDate;
      });

      for (const event of changedProjects) {
        const projectId = event.id.replace('proj-', '');
        const { error } = await supabase
          .from('projects')
          .update({ delivery_date: event.date.toISOString().split('T')[0] })
          .eq('id', projectId);
        
        if (error) {
          toast({ title: "Error al actualizar fecha", description: error.message, variant: "destructive" });
        } else {
          toast({ title: "¡Fecha actualizada!", description: `La entrega de "${event.title}" se movió.` });
        }
      }
    }
  }, [storageKey, setCalendarTasks, currentUser, projectEvents]);

  // Prevent rendering calendar if user is not yet available
  if (!user || !storageKey) {
    return <div>Cargando calendario...</div>;
  }

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