
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/hooks/useTheme';
import ProfileEditor from '@/components/ProfileEditor';

const UsersPage = ({ currentUser, users, setUsers }) => {
  const { theme } = useTheme();
  const [editingUser, setEditingUser] = useState(null);

  const handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      toast({ title: "❌ Error", description: "No puedes eliminar tu propia cuenta.", variant: "destructive" });
      return;
    }
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
    toast({ title: "🗑️ Usuario eliminado", description: "El usuario ha sido eliminado exitosamente." });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <AnimatePresence>
        {editingUser && (
          <ProfileEditor 
            user={editingUser} 
            allUsers={users} 
            setAllUsers={setUsers} 
            onClose={() => setEditingUser(null)} 
          />
        )}
      </AnimatePresence>
      <h1 className="text-3xl font-bold text-foreground mb-6">Gestión de Usuarios</h1>
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="space-y-3">
          {users.map(user => (
            <motion.div 
              key={user.id} 
              whileHover={{ backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }} 
              className="flex items-center justify-between p-3 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : user.role === 'client' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                  {user.role}
                </span>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditingUser(user)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UsersPage;
