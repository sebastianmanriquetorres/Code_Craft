
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, User, Edit, Upload, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const ProfileEditor = ({ user, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    avatar: user.avatar,
    skills: user.role === 'developer' ? (user.skills || []).join(', ') : '',
    paypal_email: user.role === 'developer' ? user.paypal_email || '' : '',
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    let { error: uploadError } = await supabase.storage.from('public-files').upload(filePath, file);

    if (uploadError) {
      toast({ title: "Error al subir imagen", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('public-files').getPublicUrl(filePath);
    setFormData(prev => ({ ...prev, avatar: publicUrl }));
    setUploading(false);
  };

  const handleSave = async () => {
    const updatedData = {
      name: formData.name,
      avatar: formData.avatar,
      skills: user.role === 'developer' ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : user.skills,
      paypal_email: user.role === 'developer' ? formData.paypal_email : user.paypal_email,
    };

    const { error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('id', user.id);

    if (error) {
      toast({ title: "❌ Error al actualizar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Perfil Actualizado" });
      onClose();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }} className="bg-card rounded-2xl shadow-2xl w-full max-w-md relative p-8 space-y-6" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}><X /></Button>
        <h2 className="text-2xl font-bold text-center">Editar Perfil</h2>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img src={formData.avatar || `https://api.dicebear.com/6.x/initials/svg?seed=${formData.name}`} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-primary" />
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
            <Button size="icon" className="absolute bottom-0 right-0 rounded-full" onClick={() => fileInputRef.current.click()} disabled={uploading}>
              <Upload className="w-4 h-4" />
            </Button>
          </div>
          {uploading && <p className="text-sm text-muted-foreground">Subiendo...</p>}
        </div>

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" name="name" placeholder="Tu nombre" value={formData.name} onChange={handleInputChange} className="w-full pl-10 p-2 bg-background border rounded" />
        </div>
        
        {user.role === 'developer' && (
          <>
            <div className="relative">
              <Edit className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" name="skills" placeholder="Habilidades (separadas por coma)" value={formData.skills} onChange={handleInputChange} className="w-full pl-10 p-2 bg-background border rounded" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="email" name="paypal_email" placeholder="Tu correo de PayPal para pagos" value={formData.paypal_email} onChange={handleInputChange} className="w-full pl-10 p-2 bg-background border rounded" />
            </div>
          </>
        )}
        
        <Button onClick={handleSave} className="w-full" disabled={uploading}>
          {uploading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProfileEditor;
