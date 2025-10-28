
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Star, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '@/hooks/useTheme';

const AdminDashboard = ({ users, projects }) => {
  const { theme } = useTheme();

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

  const COLORS = theme === 'dark' ? ['#38bdf8', '#818cf8', '#f472b6'] : ['#0ea5e9', '#6366f1', '#ec4899'];

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
      <h1 className="text-3xl font-bold text-foreground mb-6">Resumen General</h1>
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
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm h-[400px]">
          <h3 className="font-bold text-lg mb-4">Estado de Proyectos</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Pie data={projectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={'80%'} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {projectStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
