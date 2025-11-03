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

const Calendar = ({ events = [], setEvents, currentUser }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [task, setTask] = useState({ title: '', status: 'pending', color: 'bg-blue-500/10' });
  const [draggingItem, setDraggingItem] = useState(null);
  const calendarRef = useRef(null);

  const handleOpenAddTask = (day) => {
    setSelectedDate(day);
    setEditingEvent(null);
    setTask({ title: '', status: 'pending', color: 'bg-blue-500/10' });
  };
  
  const handleOpenEditTask = (event) => {
    if (event.isProject) return;
    setSelectedDate(typeof event.date === 'string' ? parseISO(event.date) : event.date);
    setEditingEvent(event);
    setTask({ title: event.title, status: event.status, color: event.color || 'bg-blue-500/10' });
  };

  const handleSaveTask = () => {
    if (!task.title) {
      toast({ title: "El título es requerido", variant: "destructive" });
      return;
    }
    
    let updatedEvents;
    if (editingEvent) {
      const updatedEvent = { ...editingEvent, ...task };
      updatedEvents = events.map(e => e.id === editingEvent.id ? updatedEvent : e);
    } else {
      const newEvent = { ...task, id: `task-${Date.now()}`, date: selectedDate };
      updatedEvents = [...events, newEvent];
    }
    setEvents(updatedEvents);
    closeModal();
  };
  
  const handleDeleteTask = () => {
    if (!editingEvent) return;
    setEvents(prev => prev.filter(e => e.id !== editingEvent.id));
    closeModal();
  };

  const handleDragStart = (e, event) => {
    if (event.isProject && currentUser.role !== 'developer') {
      e.preventDefault();
      return;
    }
    setDraggingItem(event);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, day) => {
    e.preventDefault();
    if (!draggingItem) return;

    const updatedEvents = events.map(ev => 
      ev.id === draggingItem.id ? { ...ev, date: day } : ev
    );
    setEvents(updatedEvents);
    setDraggingItem(null);
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between py-2">
      <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-xl font-bold">
        {format(currentMonth, 'MMMM yyyy')}
      </div>
      <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderDays = () => (
    <div className="grid grid-cols-7">
      {Array.from({ length: 7 }, (_, i) => (
        <div className="text-center font-medium text-muted-foreground" key={i}>
          {format(addDays(startOfWeek(startOfMonth(currentMonth)), i), 'E')}
        </div>
      ))}
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const weekDays = [];
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = events.filter(event => isSameDay(typeof event.date === 'string' ? parseISO(event.date) : event.date, cloneDay));

        weekDays.push(
          <div
            className={`p-2 h-32 border border-border/50 flex flex-col relative group ${!isSameMonth(day, monthStart) ? "bg-muted/50 text-muted-foreground" : "bg-background"} ${isSameDay(day, new Date()) ? 'bg-yellow-300/10 dark:bg-yellow-500/10' : ''}`}
            key={day.toString()}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, cloneDay)}
          >
            <span className={`font-medium ${isSameDay(day, new Date()) ? "text-yellow-600 dark:text-yellow-400 font-bold" : ""}`}>
              {format(day, "d")}
            </span>
            <Button size="icon" variant="ghost" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleOpenAddTask(cloneDay)}>
              <Plus className="h-4 w-4" />
            </Button>
            <div className="flex-grow overflow-y-auto text-xs space-y-1 mt-1">
              <TooltipProvider>
                {dayEvents.map((event) => {
                  const statusClass = event.isProject ? 'border-green-500' : (statusColorMap[event.status] || 'border-gray-500');
                  const personalColorClass = !event.isProject ? (event.color || 'bg-gray-500/10') : 'bg-green-500/10';

                  return (
                    <Tooltip key={event.id}>
                      <TooltipTrigger asChild>
                        <div 
                          draggable={!event.isProject || currentUser.role === 'developer'}
                          onDragStart={(e) => handleDragStart(e, event)}
                          onClick={() => handleOpenEditTask(event)}
                          className={`p-1 pl-2 rounded truncate border-l-4 text-foreground/90 ${!event.isProject ? 'cursor-pointer' : (currentUser.role === 'developer' ? 'cursor-grab' : 'cursor-default')} ${statusClass} ${personalColorClass}`}
                        >
                          {event.title}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{event.description || event.title}</p>
                        {!event.isProject && <p className="text-muted-foreground text-xs mt-1">Haz clic para editar</p>}
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
    return <div ref={calendarRef}>{rows}</div>;
  };

  const closeModal = () => {
    setSelectedDate(null);
    setEditingEvent(null);
  };

  return (
    <div className="relative">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <AnimatePresence>
        {selectedDate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 flex items-center justify-center z-10" onClick={closeModal}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card p-6 rounded-lg shadow-xl w-96" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-lg mb-4">{editingEvent ? 'Editar Tarea' : `Añadir Tarea para ${format(selectedDate, 'dd/MM/yyyy')}`}</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Título de la tarea" value={task.title} onChange={e => setTask({ ...task, title: e.target.value })} className="w-full p-2 bg-input border rounded" />
                
                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <select value={task.status} onChange={e => setTask({ ...task, status: e.target.value })} className="w-full p-2 bg-input border rounded mt-1">
                    <option value="pending">Pendiente</option>
                    <option value="in-progress">En Progreso</option>
                    <option value="completed">Finalizado</option>
                    <option value="delayed">Retrasado</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Color de Fondo</label>
                  <div className="grid grid-cols-8 gap-2 mt-2">
                    {Object.keys(personalColorPalette).map(colorClass => (
                      <button 
                        key={colorClass} 
                        onClick={() => setTask({...task, color: colorClass})} 
                        className={`w-6 h-6 rounded-full transition-transform transform hover:scale-110 ${task.color === colorClass ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                        title={personalColorPalette[colorClass]}
                      >
                         <div className={`w-full h-full rounded-full ${colorClass}`}></div>
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