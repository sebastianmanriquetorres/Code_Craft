import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const ProjectsPage = ({ users, projects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [projects, users, searchTerm, statusFilter]);

  const getStatusInfo = (project) => {
    switch (project.status) {
      case 'open': return { text: 'Abierto', color: 'bg-blue-500/20 text-blue-400' };
      case 'in-progress': return { text: 'En Progreso', color: 'bg-yellow-500/20 text-yellow-400' };
      case 'completed': return { text: project.paid ? 'Pagado' : 'Listo para Pagar', color: project.paid ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400' };
      default: return { text: project.status, color: 'bg-gray-500/20 text-gray-400' };
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <h1 className="text-3xl font-bold text-foreground mb-6">Vista Global de Proyectos</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Buscar por proyecto, cliente o desarrollador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 bg-card border rounded-md p-1">
          <Button variant={statusFilter === 'all' ? 'secondary' : 'ghost'} size="sm" onClick={() => setStatusFilter('all')}>Todos</Button>
          <Button variant={statusFilter === 'open' ? 'secondary' : 'ghost'} size="sm" onClick={() => setStatusFilter('open')}>Abiertos</Button>
          <Button variant={statusFilter === 'in-progress' ? 'secondary' : 'ghost'} size="sm" onClick={() => setStatusFilter('in-progress')}>En Progreso</Button>
          <Button variant={statusFilter === 'completed' ? 'secondary' : 'ghost'} size="sm" onClick={() => setStatusFilter('completed')}>Completados</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-12">No se encontraron proyectos con los filtros actuales.</p>
        ) : (
          filteredProjects.map(p => {
            const client = users.find(u => u.id === p.client_id);
            const developer = users.find(u => u.id === p.developer_id);
            const statusInfo = getStatusInfo(p);
            return (
              <motion.div key={p.id} layout className="bg-card border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg truncate" title={p.title}>{p.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
                </div>
                
                {client && <ProfileInfo user={client} label="Cliente" />}
                {developer && <ProfileInfo user={developer} label="Desarrollador" />}

                {p.status === 'in-progress' && (
                  <div>
                    <label className="text-sm font-medium">Progreso: {p.progress}%</label>
                    <div className="w-full bg-border rounded-full h-2.5 mt-1">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${p.progress}%` }}></div>
                    </div>
                  </div>
                )}

                {p.delivery_date && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Entrega:</span> {new Date(p.delivery_date).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

const ProfileInfo = ({ user, label }) => (
  <div className="flex items-center gap-3 bg-secondary p-2 rounded-md">
    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-sm">{user.name}</p>
      <p className="text-xs text-muted-foreground">{user.email}</p>
    </div>
  </div>
);

export default ProjectsPage;