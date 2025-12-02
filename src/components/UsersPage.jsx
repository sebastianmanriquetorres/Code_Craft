
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit, Ban, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/hooks/useTheme';
import ProfileEditor from '@/components/ProfileEditor';
import PaginationControl from '@/components/PaginationControl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const UsersPage = ({ currentUser, users, setUsers }) => {
  const { theme } = useTheme();
  const [editingUser, setEditingUser] = useState(null);
  const [suspendingUser, setSuspendingUser] = useState(null);
  const [suspensionDuration, setSuspensionDuration] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      toast({ title: "❌ Error", description: "No puedes eliminar tu propia cuenta.", variant: "destructive" });
      return;
    }
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    toast({ title: "🗑️ Usuario eliminado", description: "El usuario ha sido eliminado exitosamente." });
  };

  const handleSuspendUser = async () => {
      if (!suspendingUser || !suspensionDuration) return;
      
      let suspendUntil = new Date();
      let status = 'suspended';

      switch(suspensionDuration) {
          case '1h': suspendUntil.setHours(suspendUntil.getHours() + 1); break;
          case '3d': suspendUntil.setDate(suspendUntil.getDate() + 3); break;
          case '1w': suspendUntil.setDate(suspendUntil.getDate() + 7); break;
          case 'temp': suspendUntil.setFullYear(suspendUntil.getFullYear() + 10); break; // 10 years effectively permanent
          case 'unsuspend': suspendUntil = null; status = 'active'; break;
          default: return;
      }

      const { error } = await supabase.from('profiles').update({
          suspended_until: suspendUntil ? suspendUntil.toISOString() : null,
          status: status
      }).eq('id', suspendingUser.id);

      if (error) {
          toast({ title: "Error", description: "No se pudo actualizar el estado.", variant: "destructive" });
      } else {
          toast({ title: status === 'active' ? "Usuario Reactivado" : "Usuario Suspendido", description: status === 'active' ? "El usuario puede acceder nuevamente." : "El acceso ha sido revocado temporalmente." });
          
          // Log action
          await supabase.from('admin_logs').insert({
            admin_id: currentUser.id,
            action: status === 'active' ? 'unsuspend_user' : 'suspend_user',
            target_id: suspendingUser.id,
            details: `Duration: ${suspensionDuration}`
        });
      }
      
      setSuspendingUser(null);
      setSuspensionDuration('');
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const isSuspended = (user) => {
      return user.suspended_until && new Date(user.suspended_until) > new Date();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <AnimatePresence>
        {editingUser && (
          <ProfileEditor 
            user={editingUser} 
            onClose={() => setEditingUser(null)} 
          />
        )}
      </AnimatePresence>
      
      <Dialog open={!!suspendingUser} onOpenChange={() => setSuspendingUser(null)}>
        <DialogContent>
            <DialogHeader><DialogTitle>Gestionar Suspensión: {suspendingUser?.name}</DialogTitle></DialogHeader>
            <div className="py-4">
                <Select onValueChange={setSuspensionDuration}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar duración" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1h">1 Hora</SelectItem>
                        <SelectItem value="3d">3 Días</SelectItem>
                        <SelectItem value="1w">1 Semana</SelectItem>
                        <SelectItem value="temp">Indefinida (Temporal)</SelectItem>
                        <SelectItem value="unsuspend" className="text-green-600 font-bold">Levantar Suspensión</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setSuspendingUser(null)}>Cancelar</Button>
                <Button onClick={handleSuspendUser} variant={suspensionDuration === 'unsuspend' ? 'default' : 'destructive'}>Confirmar</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <h1 className="text-3xl font-bold text-foreground mb-6">Gestión de Usuarios ({users.length})</h1>
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="space-y-3">
          {paginatedUsers.map(user => {
            const suspended = isSuspended(user);
            return (
                <motion.div 
                key={user.id} 
                whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }} 
                className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${suspended ? 'border-l-destructive bg-destructive/5' : 'border-l-transparent'}`}
                >
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img src={user.avatar} alt={user.name} className={`w-10 h-10 rounded-full ${suspended ? 'grayscale' : ''}`} />
                        {suspended && <div className="absolute -bottom-1 -right-1 bg-destructive rounded-full p-0.5"><Ban className="w-3 h-3 text-white"/></div>}
                    </div>
                    <div>
                    <h3 className="font-semibold flex items-center gap-2">
                        {user.name} 
                        {suspended ? <span className="text-xs text-destructive font-bold">(Suspendido)</span> : <CheckCircle className="w-3 h-3 text-green-500"/>}
                    </h3>
                    <p className="text-muted-foreground text-sm">{user.email}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : user.role === 'client' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                    {user.role}
                    </span>
                    <div className="flex space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => setSuspendingUser(user)} title="Suspender/Reactivar">
                        <Ban className={`w-4 h-4 ${suspended ? 'text-green-500' : 'text-orange-500'}`} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingUser(user)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    </div>
                </div>
                </motion.div>
            );
          })}
        </div>
        <PaginationControl currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </motion.div>
  );
};

export default UsersPage;
