
    import React, { useState, useEffect, useRef } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { X, Paperclip } from 'lucide-react';
    import { Checkbox } from '@/components/ui/checkbox';
    import { supabase } from '@/lib/customSupabaseClient';
    import { toast } from '@/components/ui/use-toast';

    const CreateProjectForm = ({ onClose, onSubmit, template, projectToEdit, currentUser }) => {
      const [formData, setFormData] = useState({
        title: '',
        projectType: '',
        description: '',
        languages: '',
        frameworks: '',
        database: '',
        integrations: '',
        features: [],
        visualStyle: '',
        colors: '',
        references: '',
        deadline: '',
        budget: '',
        priority: 'Media',
        comments: '',
        attachments: [],
      });
      const fileInputRef = useRef(null);

      useEffect(() => {
        if (projectToEdit) {
          setFormData({
            title: projectToEdit.title || '',
            projectType: projectToEdit.project_type || '',
            description: projectToEdit.description || '',
            languages: projectToEdit.languages || '',
            frameworks: projectToEdit.frameworks || '',
            database: projectToEdit.database_type || '',
            integrations: projectToEdit.integrations || '',
            features: projectToEdit.features || [],
            visualStyle: projectToEdit.visual_style || '',
            colors: projectToEdit.colors || '',
            references: projectToEdit.reference_links || '',
            deadline: projectToEdit.deadline ? new Date(projectToEdit.deadline).toISOString().split('T')[0] : '',
            budget: projectToEdit.budget || '',
            priority: projectToEdit.priority || 'Media',
            comments: projectToEdit.comments || '',
            attachments: projectToEdit.attachments || [],
          });
        } else if (template) {
          setFormData(prev => ({
            ...prev,
            title: `Proyecto basado en: ${template.title}`,
            description: `Solicitud de personalización para la plantilla "${template.title}".\n\nDescripción original:\n${template.description}\n\nPor favor, detalla aquí las modificaciones que necesitas:`,
            references: template.demo_link || '',
          }));
        }
      }, [template, projectToEdit]);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleFeatureChange = (feature) => {
        setFormData(prev => ({
          ...prev,
          features: prev.features.includes(feature)
            ? prev.features.filter(f => f !== feature)
            : [...prev.features, feature]
        }));
      };
      
      const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const projectId = projectToEdit ? projectToEdit.id : `new-${Date.now()}`;
        const filePath = `project-attachments/${currentUser.id}/${projectId}/${file.name}`;
        const { error: uploadError } = await supabase.storage.from('project-files').upload(filePath, file, { upsert: true });

        if (uploadError) {
          toast({ title: 'Error al subir archivo', description: uploadError.message, variant: 'destructive' });
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage.from('project-files').getPublicUrl(filePath);

        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, { name: file.name, url: publicUrl }]
        }));

        toast({ title: 'Archivo adjuntado' });
      };


      const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
      };

      const featureOptions = [
        "Registro e inicio de sesión de usuarios",
        "Panel de administración",
        "Chat o mensajería",
        "Pasarela de pagos (PayPal, Stripe, etc.)",
        "Notificaciones por correo o en la app",
        "Subida y descarga de archivos",
        "Control de roles y permisos",
        "Reportes y estadísticas",
      ];

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-card rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{projectToEdit ? '✏️ Editar Proyecto' : '🧾 Solicitud de Proyecto'}</h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4"><X /></Button>
            </div>
            
            {template && !projectToEdit && (
              <div className="flex gap-4 items-center bg-secondary p-4 rounded-lg mb-6">
                <img src={template.image_url} alt={template.title} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <p className="text-sm text-muted-foreground">Basado en la plantilla:</p>
                  <h3 className="font-bold text-lg">{template.title}</h3>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Section title="1. Información General">
                <Input name="title" label="Nombre del Proyecto" value={formData.title} onChange={handleChange} required />
                <Select name="projectType" label="Tipo de Proyecto" value={formData.projectType} onChange={handleChange} options={["Página web", "Aplicación móvil", "Sistema de escritorio", "API o backend", "Otro"]} />
                <Textarea name="description" label="Descripción Detallada" value={formData.description} onChange={handleChange} required />
              </Section>

              <Section title="2. Requisitos Técnicos (Opcional)">
                <Input name="languages" label="Lenguajes Preferidos" value={formData.languages} onChange={handleChange} placeholder="Ej: JavaScript, Python" />
                <Input name="frameworks" label="Frameworks Preferidos" value={formData.frameworks} onChange={handleChange} placeholder="Ej: React, Node.js" />
                <Input name="database" label="Base de Datos" value={formData.database} onChange={handleChange} placeholder="Ej: MySQL, MongoDB" />
                <Input name="integrations" label="APIs a Integrar" value={formData.integrations} onChange={handleChange} placeholder="Ej: PayPal, Google Maps" />
              </Section>

              <Section title="3. Funcionalidades Principales">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featureOptions.map(feature => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox id={feature} checked={formData.features.includes(feature)} onCheckedChange={() => handleFeatureChange(feature)} />
                      <label htmlFor={feature} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{feature}</label>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="4. Diseño y Experiencia de Usuario">
                <Select name="visualStyle" label="Estilo Visual Preferido" value={formData.visualStyle} onChange={handleChange} options={["Moderno / minimalista", "Corporativo / profesional", "Creativo / colorido", "Sencillo y funcional", "Otro"]} />
                <Input name="colors" label="Colores o Temas (Opcional)" value={formData.colors} onChange={handleChange} placeholder="Ej: Azul y blanco, modo oscuro" />
                <Input name="references" label="Ejemplos o Referencias (Opcional)" value={formData.references} onChange={handleChange} placeholder="https://ejemplo.com" />
              </Section>

              <Section title="5. Alcance y Tiempos">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input type="date" name="deadline" label="Fecha Límite Deseada" value={formData.deadline} onChange={handleChange} />
                  <Input name="budget" label="Presupuesto (USD)" value={formData.budget} onChange={handleChange} placeholder="Ej: 500" />
                  <Select name="priority" label="Prioridad" value={formData.priority} onChange={handleChange} options={["Alta (urgente)", "Media", "Baja"]} />
                </div>
              </Section>

              <Section title="6. Información Adicional">
                <Textarea name="comments" label="Comentarios o Notas Adicionales" value={formData.comments} onChange={handleChange} />
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()}><Paperclip className="w-4 h-4 mr-2" /> Adjuntar Archivos</Button>
                <div className="mt-2 space-y-1">
                  {formData.attachments?.map((file, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Paperclip className="w-3 h-3" />
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{file.name}</a>
                    </div>
                  ))}
                </div>
              </Section>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button type="submit">{projectToEdit ? 'Guardar Cambios' : 'Generar Solicitud'}</Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      );
    };

    const Section = ({ title, children }) => (
      <div className="space-y-4 border-t border-border pt-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {children}
      </div>
    );

    const Input = ({ label, name, ...props }) => (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
        <input id={name} name={name} className="w-full p-2 bg-background border rounded-md" {...props} />
      </div>
    );

    const Textarea = ({ label, name, ...props }) => (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
        <textarea id={name} name={name} rows="4" className="w-full p-2 bg-background border rounded-md" {...props}></textarea>
      </div>
    );

    const Select = ({ label, name, options, ...props }) => (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
        <select id={name} name={name} className="w-full p-2 bg-background border rounded-md" {...props}>
          <option value="">Seleccionar...</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    );

    export default CreateProjectForm;
  