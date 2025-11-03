
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Plus, X, Upload, Link, Image as ImageIcon, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const StorePage = ({ currentUser }) => {
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ title: '', description: '', image_url: '', demo_link: '' });
  const [imageFile, setImageFile] = useState(null);
  const { addToCart, cartItems } = useCart();

  const favoriteIds = cartItems.map(item => item.variant.id);

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase.from('dev_templates').select('*, profiles(name, avatar, email)');
      if (error) {
        toast({ title: "Error al cargar plantillas", variant: "destructive" });
      } else {
        setTemplates(data);
      }
    };
    fetchTemplates();

    const channel = supabase.channel('dev_templates_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dev_templates' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const fetchNewTemplate = async () => {
             const { data, error } = await supabase.from('dev_templates').select('*, profiles(name, avatar, email)').eq('id', payload.new.id).single();
             if(!error && data){
                setTemplates(current => [...current, data]);
             }
          }
          fetchNewTemplate();
        } else if (payload.eventType === 'UPDATE') {
            setTemplates(current => current.map(t => t.id === payload.new.id ? {...t, ...payload.new} : t));
        } else if (payload.eventType === 'DELETE') {
            setTemplates(current => current.filter(t => t.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const filePath = `template-images/${currentUser.id}-${Date.now()}-${imageFile.name}`;
    const { error } = await supabase.storage.from('public-files').upload(filePath, imageFile);
    if (error) {
      toast({ title: "Error al subir imagen", description: error.message, variant: "destructive" });
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from('public-files').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    let imageUrl = newTemplate.image_url;
    if (imageFile) {
      imageUrl = await handleImageUpload();
      if (!imageUrl) return;
    }

    const { error } = await supabase.from('dev_templates').insert([{
      ...newTemplate,
      image_url: imageUrl,
      developer_id: currentUser.id
    }]);

    if (error) {
      toast({ title: "Error al crear plantilla", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Plantilla creada con éxito" });
      setShowForm(false);
      setNewTemplate({ title: '', description: '', image_url: '', demo_link: '' });
      setImageFile(null);
    }
  };

  const handleAddToFavorites = (template) => {
    const cartItem = {
      product: {
          id: `template-prod-${template.id}`,
          title: template.title,
          image: template.image_url,
      },
      variant: {
          id: template.id,
          title: 'Plantilla Base',
      },
      quantity: 1,
      type: 'template',
      templateData: template,
    };
    addToCart(cartItem.product, cartItem.variant, 1)
        .then(() => {
            toast({ title: "Añadido a Favoritos", description: `"${template.title}" se ha guardado en tu lista.` });
        })
        .catch(error => {
            toast({ title: "Error", description: error.message, variant: 'destructive' });
        });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4">
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-card rounded-xl p-6 w-full max-w-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Crear Nueva Plantilla</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
              </div>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <input type="text" placeholder="Título de la plantilla" value={newTemplate.title} onChange={e => setNewTemplate({ ...newTemplate, title: e.target.value })} className="w-full p-2 bg-background border rounded" required />
                <textarea placeholder="Descripción detallada" value={newTemplate.description} onChange={e => setNewTemplate({ ...newTemplate, description: e.target.value })} className="w-full p-2 bg-background border rounded h-24" required />
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                  <input type="text" placeholder="URL de la imagen" value={newTemplate.image_url} onChange={e => setNewTemplate({ ...newTemplate, image_url: e.target.value })} className="w-full p-2 bg-background border rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <input type="file" onChange={e => setImageFile(e.target.files[0])} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </div>
                <div className="flex items-center gap-2">
                  <Link className="w-5 h-5 text-muted-foreground" />
                  <input type="text" placeholder="Enlace a la demo (opcional)" value={newTemplate.demo_link} onChange={e => setNewTemplate({ ...newTemplate, demo_link: e.target.value })} className="w-full p-2 bg-background border rounded" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
                  <Button type="submit">Crear Plantilla</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Galería de Plantillas</h1>
        {currentUser.role === 'developer' && (
          <Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" /> Crear Plantilla</Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map(template => (
          <motion.div key={template.id} className="bg-card border rounded-lg overflow-hidden group" whileHover={{ y: -5 }}>
            <div className="h-48 bg-muted overflow-hidden">
              <img class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" alt={template.title} src={template.image_url || "https://images.unsplash.com/photo-1702724122866-8898b15ebeac"} />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{template.title}</h2>
              <div className="flex items-center gap-2 mb-4">
                <img src={template.profiles?.avatar} alt={template.profiles?.name} className="w-6 h-6 rounded-full" />
                <span className="text-sm text-muted-foreground">{template.profiles?.name || 'Usuario desconocido'}</span>
              </div>
              <p className="text-muted-foreground mb-6 h-20 overflow-hidden">{template.description}</p>
              <div className="flex gap-2">
                {template.demo_link && <a href={template.demo_link} target="_blank" rel="noopener noreferrer"><Button variant="outline">Ver Demo</Button></a>}
                {currentUser.role === 'client' && (
                  <Button onClick={() => handleAddToFavorites(template)} disabled={favoriteIds.includes(template.id)}>
                    <Heart className={`mr-2 h-4 w-4 ${favoriteIds.includes(template.id) ? 'fill-current' : ''}`} />
                    {favoriteIds.includes(template.id) ? 'En Favoritos' : 'Añadir a Favoritos'}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StorePage;
