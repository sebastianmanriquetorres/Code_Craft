
import React, { useState, useRef } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const statusColorMap = {
  pending: 'border-blue-500',
  'in-progress': 'border-orange-500',
  completed: 'border-green-500',
  delayed: 'border-red-500',
};

const personalColorPalette = {
  'bg-red-500/10': 'Rojo',
  'bg-orange-500/10': 'Naranja',
  'bg-amber-500/10': 'Ámbar',
  'bg-yellow-500/10': 'Amarillo',
  'bg-lime-500/10': 'Lima',
  'bg-green-500/10': 'Verde',
  'bg-emerald-500/10': 'Esmeralda',
  'bg-teal-500/10': 'Turquesa',
  'bg-cyan-500/10': 'Cian',
  'bg-sky-500/10': 'Cielo',
  'bg-blue-500/10': 'Azul',
  'bg-indigo-500/10': 'Índigo',
  'bg-violet-500/10': 'Violeta',
  'bg-purple-500/10': 'Púrpura',
  'bg-fuchsia-500/10': 'Fucsia',
  'bg-pink-500/10': 'Rosa',
};

const Calendar = ({ events = [], setEvents, currentUser, onEventClick, onSaveEvent, onDeleteEvent }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [task, setTask] = useState({ title: '', description: '', status: 'pending', color: 'bg-blue-500/10' });
  const calendarRef = useRef(null);

  const handleOpenAddTask = (day) => {
    setSelectedDate(day);
    setEditingEvent(null);
    setTask({ title: '', description: '', status: 'pending', color: 'bg-blue-500/10' });
  };
  
  const handleEventInteraction = (event) => {
    if (event.isProject) {
        if (onEventClick) {
            onEventClick(event);
        }
    } else {
        // Handle personal task editing (view only for now to keep simple, or delete)
        setSelectedDate(typeof event.date === 'string' ? parseISO(event.date) : event.date);
        setEditingEvent(event);
        setTask({ 
            title: event.title, 
            description: event.description || '', 
            status: event.status, 
            color: event.color || 'bg-blue-500/10' 
        });
    }
  };

  const handleSaveTask = () => {
    if (!task.title) {
      toast({ title: "El título es requerido", variant: "destructive" });
      return;
    }
    
    if (onSaveEvent) {
        onSaveEvent({ ...task, date: selectedDate });
    }
    closeModal();
  };
  
  const handleDeleteTask = () => {
    if (!editingEvent || !onDeleteEvent) return;
    onDeleteEvent(editingEvent.id);
    closeModal();
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between py-4 px-2 bg-card rounded-t-lg border-b border-border">
      <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <div className="text-xl font-bold text-foreground">
        {format(currentMonth, 'MMMM yyyy')}
      </div>
      <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7 bg-muted/30">
      {Array.from({ length: 7 }, (_, i) => (
        <div className="text-center font-bold text-muted-foreground py-3 text-sm uppercase tracking-wide border-r border-border/50 last:border-r-0" key={i}>
          {format(addDays(startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }), i), 'E')}
        </div>
      ))}
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = events.filter(event => isSameDay(typeof event.date === 'string' ? parseISO(event.date) : event.date, cloneDay));
        const isCurrentMonth = isSameMonth(day, monthStart);

        weekDays.push(
          <div
            className={`min-h-[140px] p-2 border-b border-r border-border flex flex-col relative group transition-colors
              ${!isCurrentMonth ? "bg-muted/20 text-muted-foreground" : "bg-card text-foreground hover:bg-accent/5"} 
              ${isSameDay(day, new Date()) ? 'bg-primary/10' : ''}
            `}
            key={day.toString()}
          >
            <span className={`font-medium text-sm mb-1 ${isSameDay(day, new Date()) ? "text-primary font-bold" : ""}`}>
              {format(day, "d")}
            </span>
            
            <Button size="icon" variant="ghost" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleOpenAddTask(cloneDay)}>
              <Plus className="h-4 w-4" />
            </Button>

            <div className="flex-grow overflow-y-auto text-xs space-y-1 mt-1 custom-scrollbar">
              <TooltipProvider>
                {dayEvents.map((event) => {
                  const isProject = event.isProject;
                  const cursorClass = 'cursor-pointer';

                  return (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <div 
                          onClick={() => handleEventInteraction(event)}
                          className={`p-1.5 pl-2 rounded-md text-xs font-medium shadow-sm truncate border-l-[3px] transition-all hover:opacity-90
                            ${event.borderColor || statusColorMap[event.status] || 'border-gray-500'} 
                            ${event.color || 'bg-secondary'} 
                            ${cursorClass}
                            text-foreground/90
                          `}
                        >
                          {event.title}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-bold">{event.title}</p>
                        {event.description && <p className="max-w-xs">{event.description}</p>}
                        <p className="text-muted-foreground text-xs mt-1">Haz clic para ver detalles</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7" key={day.toString()}>{weekDays}</div>);
    }
    return <div ref={calendarRef} className="border-t border-l border-border rounded-b-lg overflow-hidden">{rows}</div>;
  };

  const closeModal = () => {
    setSelectedDate(null);
    setEditingEvent(null);
  };

  return (
    <div className="relative rounded-lg border border-border shadow-sm bg-card">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <AnimatePresence>
        {selectedDate && !editingEvent?.isProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10" onClick={closeModal}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card p-6 rounded-lg shadow-xl w-96 border border-border" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-lg mb-4 text-foreground">{editingEvent ? 'Editar Tarea' : `Añadir Tarea para ${format(selectedDate, 'dd/MM/yyyy')}`}</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Título de la tarea" value={task.title} onChange={e => setTask({ ...task, title: e.target.value })} className="w-full p-2 bg-input border border-input rounded focus:ring-2 focus:ring-primary text-foreground" />
                <textarea placeholder="Descripción" value={task.description} onChange={e => setTask({ ...task, description: e.target.value })} className="w-full p-2 bg-input border border-input rounded focus:ring-2 focus:ring-primary text-foreground h-20" />
                
                <div>
                  <label className="text-sm font-medium text-foreground">Estado</label>
                  <select value={task.status} onChange={e => setTask({ ...task, status: e.target.value })} className="w-full p-2 bg-input border border-input rounded mt-1 text-foreground">
                    <option value="pending">Pendiente</option>
                    <option value="in-progress">En Progreso</option>
                    <option value="completed">Finalizado</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Color de Fondo</label>
                  <div className="grid grid-cols-8 gap-2 mt-2">
                    {Object.keys(personalColorPalette).map(colorClass => (
                      <button 
                        key={colorClass} 
                        onClick={() => setTask({...task, color: colorClass})} 
                        className={`w-6 h-6 rounded-full transition-transform transform hover:scale-110 ${task.color === colorClass ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                        title={personalColorPalette[colorClass]}
                      >
                         <div className={`w-full h-full rounded-full ${colorClass} border border-white/10`}></div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div>
                    {editingEvent && (
                      <Button variant="destructive" size="icon" onClick={handleDeleteTask}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
                    <Button onClick={handleSaveTask}>{editingEvent ? 'Guardar Cambios' : 'Añadir'}</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
