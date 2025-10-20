
import React, { useState, useRef } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Calendar = ({ events = [], setEvents, currentUser }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [task, setTask] = useState({ title: '', status: 'pending' });
  const [draggingItem, setDraggingItem] = useState(null);
  const calendarRef = useRef(null);

  const handleAddTask = () => {
    if (!task.title) {
      toast({ title: "El título es requerido", variant: "destructive" });
      return;
    }
    const newEvent = {
      id: `task-${Date.now()}`,
      date: selectedDate,
      title: task.title,
      color: task.status === 'pending' ? 'orange' : 'blue',
      status: task.status,
    };
    setEvents(prev => [...prev, newEvent]);
    setSelectedDate(null);
    setTask({ title: '', status: 'pending' });
  };

  const handleDragStart = (e, event) => {
    if (event.isProject && currentUser.role !== 'developer') {
      e.preventDefault();
      return;
    }
    setDraggingItem(event);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

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

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(startOfMonth(currentMonth));
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-medium text-muted-foreground" key={i}>
          {format(addDays(startDate, i), 'E')}
        </div>
      );
    }
    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayEvents = events.filter(event => isSameDay(typeof event.date === 'string' ? parseISO(event.date) : event.date, cloneDay));

        days.push(
          <div
            className={`p-2 h-32 border border-border/50 flex flex-col relative group ${!isSameMonth(day, monthStart) ? "bg-muted/50 text-muted-foreground" : "bg-background"} ${isSameDay(day, new Date()) ? 'bg-yellow-300/10 dark:bg-yellow-500/10' : ''}`}
            key={day}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, cloneDay)}
          >
            <span className={`font-medium ${isSameDay(day, new Date()) ? "text-yellow-600 dark:text-yellow-400 font-bold" : ""}`}>
              {format(day, "d")}
            </span>
            {currentUser.role === 'admin' && (
              <Button size="icon" variant="ghost" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => setSelectedDate(cloneDay)}>
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-grow overflow-y-auto text-xs space-y-1 mt-1">
              <TooltipProvider>
                {dayEvents.map((event, index) => (
                  <Tooltip key={event.id || index}>
                    <TooltipTrigger asChild>
                      <div 
                        draggable={!event.isProject || currentUser.role === 'developer'}
                        onDragStart={(e) => handleDragStart(e, event)}
                        className={`p-1 rounded truncate ${event.isProject && currentUser.role === 'developer' ? 'cursor-grab' : 'cursor-default'} ${event.color === 'green' ? 'bg-green-500/20 text-green-700 dark:text-green-300' : event.color === 'blue' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' : 'bg-orange-500/20 text-orange-700 dark:text-orange-300'}`}
                      >
                        {event.title}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{event.description || event.title}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div ref={calendarRef}>{rows}</div>;
  };

  return (
    <div className="relative">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <AnimatePresence>
        {selectedDate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 flex items-center justify-center z-10" onClick={() => setSelectedDate(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-card p-6 rounded-lg shadow-xl w-96" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-lg mb-4">Añadir Tarea para {format(selectedDate, 'dd/MM/yyyy')}</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Título de la tarea" value={task.title} onChange={e => setTask({ ...task, title: e.target.value })} className="w-full p-2 bg-background border rounded" />
                <select value={task.status} onChange={e => setTask({ ...task, status: e.target.value })} className="w-full p-2 bg-background border rounded">
                  <option value="pending">Pendiente</option>
                  <option value="in-progress">En Progreso</option>
                </select>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setSelectedDate(null)}>Cancelar</Button>
                  <Button onClick={handleAddTask}>Añadir</Button>
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
