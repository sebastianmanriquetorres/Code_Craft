
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, Star, DollarSign, AlertTriangle, Send, Bell, Activity, Search, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import ProjectDetailsModal from '@/components/ProjectDetailsModal';

const AdminDashboard = ({ users, projects, currentUser }) => {
  const { theme } = useTheme();
  const [riskProjects, setRiskProjects] = useState([]);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notificationData, setNotificationData] = useState({ userId: '', projectId: '', message: '' });
  const [logs, setLogs] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // New Notification Search States
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUserForNotify, setSelectedUserForNotify] = useState(null);

  // 1. Logic to identify Projects at Risk
  useEffect(() => {
    const checkRisks = () => {
      const today = new Date();
      const getBusinessDays = (startDate, endDate) => {
        let count = 0;
        const curDate = new Date(startDate.getTime());
        while (curDate <= endDate) {
          const dayOfWeek = curDate.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
          curDate.setDate(curDate.getDate() + 1);
        }
        return count;
      };

      const risky = projects.filter(p => {
        if (!p.delivery_date || p.status === 'completed' || p.progress >= 90) return false;
        const delivery = new Date(p.delivery_date);
        const businessDaysLeft = getBusinessDays(today, delivery);
        return businessDaysLeft <= 7;
      });

      setRiskProjects(risky);
      
      risky.forEach(async (p) => {
         if (p.developer_id) {
             const key = `notified_risk_${p.id}`;
             const lastNotified = localStorage.getItem(key);
             if (!lastNotified) {
                 await supabase.from('internal_notifications').insert({
                     recipient_id: p.developer_id,
                     sender_id: currentUser.id,
                     project_id: p.id,
                     message: `⚠️ ALERTA DE MONITOREO: Tu proyecto "${p.title}" ha entrado en zona de riesgo. Quedan 7 días o menos y el progreso es menor al 90%. Por favor reporta avances.`,
                 });
                 localStorage.setItem(key, new Date().toISOString());
             }
         }
      });
    };

    checkRisks();
  }, [projects, currentUser]);

  // Fetch Admin Logs
  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(20);
      if (data) setLogs(data);
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    if (userSearchTerm.length >= 2) {
      const lowerTerm = userSearchTerm.toLowerCase();
      const matches = users.filter(u => 
        u.name.toLowerCase().includes(lowerTerm) || 
        u.email.toLowerCase().includes(lowerTerm) ||
        (u.username && u.username.toLowerCase().includes(lowerTerm))
      ).slice(0, 5); // Limit to 5 results
      setFilteredUsers(matches);
    } else {
      setFilteredUsers([]);
    }
  }, [userSearchTerm, users]);

  const handleSelectUser = (user) => {
    setSelectedUserForNotify(user);
    setNotificationData(prev => ({ ...prev, userId: user.id }));
    setUserSearchTerm('');
    setFilteredUsers([]);
  };

  const handleClearSelectedUser = () => {
    setSelectedUserForNotify(null);
    setNotificationData(prev => ({ ...prev, userId: '' }));
  };

  const handleSendNotification = async () => {
    if (!notificationData.userId || !notificationData.message) {
      toast({ title: "Error", description: "Usuario y mensaje son obligatorios.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from('internal_notifications').insert({
      recipient_id: notificationData.userId,
      sender_id: currentUser.id,
      project_id: notificationData.projectId || null,
      message: notificationData.message
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Enviado", description: "Notificación enviada correctamente." });
      setShowNotifyModal(false);
      setNotificationData({ userId: '', projectId: '', message: '' });
      setSelectedUserForNotify(null);
      
      // Log action
      await supabase.from('admin_logs').insert({
          admin_id: currentUser.id,
          action: 'send_notification',
          target_id: notificationData.userId,
          details: `Message: ${notificationData.message.substring(0, 20)}...`
      });
    }
  };

  const stats = useMemo(() => ({
    totalUsers: users.length,
    clients: users.filter(u => u.role === 'client').length,
    developers: users.filter(u => u.role === 'developer').length,
    projectsInProgress: projects.filter(p => p.status === 'in-progress').length,
    projectsCompleted: projects.filter(p => p.status === 'completed').length,
    totalRevenue: projects.filter(p => p.status === 'completed' && p.price).reduce((acc, p) => acc + p.price, 0),
  }), [users, projects]);

  const projectStatusData = useMemo(() => [
    { name: 'Abiertos', value: projects.filter(p => p.status === 'open').length },
    { name: 'En Progreso', value: stats.projectsInProgress },
    { name: 'Completados', value: stats.projectsCompleted },
  ], [projects, stats]);

  const userRoleData = useMemo(() => [
    { name: 'Clientes', value: stats.clients },
    { name: 'Desarrolladores', value: stats.developers },
  ], [stats]);

  const PIE_CHART_COLORS = theme === 'dark' ? ['#60a5fa', '#a78bfa', '#f87171'] : ['#3b82f6', '#8b5cf6', '#ef4444'];
  const BAR_CHART_FILL = '#3b82f6';

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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {/* Re-located button */}
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Resumen General</h1>
          <Button onClick={() => setShowNotifyModal(true)} className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
              <Send className="w-4 h-4" /> Enviar Notificación
          </Button>
      </div>
      
      {/* Risk Alerts Section */}
      {riskProjects.length > 0 && (
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-bold text-destructive flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" /> Proyectos en Riesgo ({riskProjects.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {riskProjects.map(p => {
              const dev = users.find(u => u.id === p.developer_id);
              const client = users.find(u => u.id === p.client_id);
              return (
                <div key={p.id} className="bg-destructive/10 border border-destructive/50 rounded-lg p-4 space-y-2 relative">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold truncate w-4/5">{p.title}</h3>
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="text-sm space-y-1">
                    <p><span className="font-semibold">Dev:</span> {dev?.name || 'N/A'}</p>
                    <p><span className="font-semibold">Cliente:</span> {client?.name || 'N/A'}</p>
                    <div className="flex justify-between items-center">
                       <span>Progreso:</span>
                       <span className="font-bold text-destructive">{p.progress}%</span>
                    </div>
                    <p><span className="font-semibold">Entrega:</span> {new Date(p.delivery_date).toLocaleDateString()}</p>
                  </div>
                  <Button size="sm" variant="destructive" className="w-full mt-2" onClick={() => setSelectedProject(p)}>
                    Ver Proyecto
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <StatCard icon={Users} title="Total Usuarios" value={stats.totalUsers} color="text-blue-500" />
        <StatCard icon={Briefcase} title="Proyectos Activos" value={stats.projectsInProgress} color="text-yellow-500" />
        <StatCard icon={Star} title="Proyectos Completados" value={stats.projectsCompleted} color="text-green-500" />
        <StatCard icon={DollarSign} title="Ingresos Totales" value={`$${stats.totalRevenue.toLocaleString()}`} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 shadow-sm h-[400px]">
          <h3 className="font-bold text-lg mb-4">Distribución de Usuarios</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={userRoleData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip cursor={{fill: 'hsla(var(--accent))'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Bar dataKey="value" fill={BAR_CHART_FILL} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm h-[400px]">
          <h3 className="font-bold text-lg mb-4">Estado de Proyectos</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={'80%'} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {projectStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Admin Activity Log */}
      <div className="mt-8 bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity className="w-5 h-5"/> Registro de Acciones de Admin</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
           {logs.length === 0 ? <p className="text-sm text-muted-foreground">No hay registros.</p> : logs.map(log => (
               <div key={log.id} className="text-sm border-b pb-2 last:border-0">
                   <span className="font-semibold">{new Date(log.created_at).toLocaleString()}:</span> {log.action} - <span className="text-muted-foreground">{log.details}</span>
               </div>
           ))}
        </div>
      </div>

      {/* Notification Modal - IMPROVED SEARCH */}
      <Dialog open={showNotifyModal} onOpenChange={setShowNotifyModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enviar Notificación Interna</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            
            {/* Smart Search Field */}
            <div className="space-y-2 relative">
                <label className="text-sm font-medium">Usuario Destino</label>
                {!selectedUserForNotify ? (
                  <>
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por nombre, email..." 
                            value={userSearchTerm}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    {filteredUsers.length > 0 && (
                        <div className="absolute z-50 w-full bg-popover border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                            {filteredUsers.map(u => (
                                <div 
                                    key={u.id} 
                                    className="p-2 hover:bg-accent cursor-pointer flex flex-col text-sm"
                                    onClick={() => handleSelectUser(u)}
                                >
                                    <span className="font-bold">{u.name}</span>
                                    <span className="text-xs text-muted-foreground">{u.email} - {u.role}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {userSearchTerm.length >= 2 && filteredUsers.length === 0 && (
                         <p className="text-xs text-muted-foreground mt-1">No se encontraron usuarios.</p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-between p-2 border rounded-md bg-secondary/20">
                      <div className="flex flex-col">
                          <span className="font-bold text-sm">{selectedUserForNotify.name}</span>
                          <span className="text-xs text-muted-foreground">{selectedUserForNotify.email} ({selectedUserForNotify.role})</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleClearSelectedUser}><X className="w-4 h-4" /></Button>
                  </div>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Proyecto (Opcional)</label>
                <Select onValueChange={(val) => setNotificationData({...notificationData, projectId: val})}>
                    <SelectTrigger><SelectValue placeholder="Relacionar con proyecto" /></SelectTrigger>
                    <SelectContent>
                        {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Mensaje</label>
                <Textarea 
                    value={notificationData.message} 
                    onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
                    placeholder="Escribe tu mensaje aquí..."
                />
            </div>
          </div>
          <DialogFooter>
              <Button variant="outline" onClick={() => setShowNotifyModal(false)}>Cancelar</Button>
              <Button onClick={handleSendNotification} disabled={!selectedUserForNotify}>Enviar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedProject && <ProjectDetailsModal project={selectedProject} onClose={() => setSelectedProject(null)} currentUser={currentUser} />}
    </motion.div>
  );
};

export default AdminDashboard;
