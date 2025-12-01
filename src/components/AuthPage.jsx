
import React, { useState, useContext, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Star, Code, HelpCircle, Sun, Moon, AlertCircle, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ThemeContext } from '@/context/ThemeContext';
import SpaceBackground from '@/components/SpaceBackground';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsText, PrivacyText } from '@/components/LegalTexts';

const AuthForm = ({ isLogin, formData, handleInputChange, handleMainSubmit, setIsLogin, setIsForgotPassword, loading, errors, setFormData }) => {
  const { theme } = useContext(ThemeContext);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="relative z-10 bg-card/80 dark:bg-card/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-border/20">
      
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Términos y Condiciones</DialogTitle>
            <DialogDescription>Por favor lee atentamente nuestros términos.</DialogDescription>
          </DialogHeader>
          <TermsText />
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Política de Privacidad</DialogTitle>
            <DialogDescription>Así es como manejamos tus datos.</DialogDescription>
          </DialogHeader>
          <PrivacyText />
        </DialogContent>
      </Dialog>

      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <svg className="w-20 h-20 mx-auto mb-4" viewBox="0 0 100 100">
            <motion.path
              d="M50 10 C 30 10, 20 30, 20 50 C 20 70, 30 90, 50 90 C 70 90, 80 70, 80 50 C 80 30, 70 10, 50 10 Z"
              fill="none"
              stroke={theme === 'dark' ? '#fde047' : '#facc15'}
              strokeWidth="3"
            />
            <motion.path
              d="M40 50 L 45 55 L 55 45 M 45 55 L 50 60 L 60 50"
              fill="none"
              stroke={theme === 'dark' ? '#fef08a' : '#fde047'}
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </svg>
        </motion.div>
        <motion.h1 
          className="text-3xl font-bold text-foreground mb-2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ¡Bienvenido a Code_Craft!
        </motion.h1>
        <motion.p 
          className="text-muted-foreground"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isLogin ? 'Accede a tu universo de proyectos.' : 'Únete a la galaxia de talentos.'}
        </motion.p>
      </div>
      <form onSubmit={handleMainSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <FormInput icon={User} type="text" name="name" placeholder="Nombre completo" value={formData.name} onChange={handleInputChange} required error={errors.name} />
            <FormSelect icon={Star} name="role" value={formData.role} onChange={handleInputChange} options={[{value: 'client', label: 'Soy un Cliente'}, {value: 'developer', label: 'Soy un Desarrollador'}]} required error={errors.role} />
            {formData.role === 'developer' && <FormInput icon={Code} type="text" name="skills" placeholder="Habilidades (React, Node, etc.)" value={formData.skills} onChange={handleInputChange} error={errors.skills} />}
          </>
        )}
        <FormInput icon={Mail} type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleInputChange} required error={errors.email} />
        <FormInput icon={Lock} type="password" name="password" placeholder="Contraseña (mín. 6 caracteres)" value={formData.password} onChange={handleInputChange} required error={errors.password} />
        
        {!isLogin && (
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox 
              id="terms" 
              checked={formData.termsAccepted}
              onCheckedChange={(checked) => setFormData(prev => ({...prev, termsAccepted: checked}))}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Acepto los <span onClick={() => setShowTerms(true)} className="text-primary underline cursor-pointer hover:text-primary/80">Términos y Condiciones</span> y la <span onClick={() => setShowPrivacy(true)} className="text-primary underline cursor-pointer hover:text-primary/80">Política de Privacidad</span>.
              </label>
              {errors.termsAccepted && <p className="text-xs text-destructive">{errors.termsAccepted}</p>}
            </div>
          </div>
        )}

        {isLogin && <div className="text-right"><button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm text-primary hover:underline">¿Olvidaste tu contraseña?</button></div>}
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2.5 rounded-lg transition-transform transform hover:scale-105">{loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}</Button>
      </form>
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">{isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}</button>
        <a 
          href="https://drive.google.com/drive/folders/1e5f6ioQmZqgeT_c4LXzgPjmBxc8IzAt1?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Book className="w-4 h-4" /> Manuales
        </a>
      </div>
    </motion.div>
  );
};

const FormInput = ({ icon: Icon, error, ...props }) => (
  <div>
    <div className="relative">
      <Icon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
      <input 
        className={`w-full pl-10 pr-4 py-2 bg-background border rounded-lg focus:ring-2 outline-none transition-colors ${
          error ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-primary/50'
        }`}
        {...props} 
      />
    </div>
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-1 mt-1 text-xs text-destructive"
        >
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FormSelect = ({ icon: Icon, options, error, ...props }) => (
  <div>
    <div className="relative">
      <Icon className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
      <select 
        className={`w-full pl-10 pr-4 py-2 bg-background border rounded-lg appearance-none focus:ring-2 outline-none transition-colors ${
          error ? 'border-destructive focus:ring-destructive' : 'border-input focus:ring-primary/50'
        }`}
        {...props}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-1 mt-1 text-xs text-destructive"
        >
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const ForgotPasswordForm = ({ resetEmail, setResetEmail, handleResetRequestSubmit, setIsForgotPassword, loading, error }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="relative z-10 bg-card/80 dark:bg-card/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-border/20">
    <div className="text-center mb-8">
      <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-foreground">Restablecer Contraseña</h1>
      <p className="text-muted-foreground">Ingresa tu correo para recibir un enlace.</p>
    </div>
    <form onSubmit={handleResetRequestSubmit} className="space-y-4">
      <FormInput icon={Mail} type="email" placeholder="Correo electrónico" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required error={error} />
      <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2.5 rounded-lg">{loading ? 'Enviando...' : 'Enviar Enlace'}</Button>
    </form>
    <div className="mt-6 flex justify-between items-center">
      <button onClick={() => setIsForgotPassword(false)} className="text-sm text-primary hover:underline">Volver a Iniciar Sesión</button>
      <a 
          href="https://drive.google.com/drive/folders/1e5f6ioQmZqgeT_c4LXzgPjmBxc8IzAt1?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Book className="w-4 h-4" /> Manuales
        </a>
    </div>
  </motion.div>
);

const AuthFooter = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <div className="absolute bottom-4 left-0 right-0 z-20 flex flex-col items-center justify-center gap-2 text-center">
      
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Términos y Condiciones</DialogTitle>
          </DialogHeader>
          <TermsText />
        </DialogContent>
      </Dialog>

      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Política de Privacidad</DialogTitle>
          </DialogHeader>
          <PrivacyText />
        </DialogContent>
      </Dialog>

      <p className="text-[10px] text-muted-foreground/60">
        © 2025 Code_Craft • proyectcodecraft@gmail.com
      </p>
      <div className="flex gap-4 text-[10px] text-muted-foreground/80">
        <button onClick={() => setShowTerms(true)} className="hover:text-primary hover:underline transition-colors">Términos y Condiciones</button>
        <span>|</span>
        <button onClick={() => setShowPrivacy(true)} className="hover:text-primary hover:underline transition-colors">Privacidad</button>
      </div>
    </div>
  );
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'client', skills: '', termsAccepted: false });
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { theme, setTheme } = useContext(ThemeContext);
  const { signIn, signUp, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const wasIdle = sessionStorage.getItem('idleTimeout');
    if (wasIdle) {
      toast({
        title: "🔒 Sesión cerrada por inactividad",
        description: "Por seguridad, tu sesión se ha cerrado tras 15 minutos de inactividad.",
        duration: 6000,
      });
      sessionStorage.removeItem('idleTimeout');
    }
  }, [toast]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre es obligatorio';
      }
      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'Debes aceptar los términos y condiciones';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMainSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    if (isLogin) {
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({ title: "❌ Cuenta inválida", description: "Revisa tu correo y contraseña.", variant: "destructive" });
      } else {
        // Check for suspension
        const { data: profile } = await supabase.from('profiles').select('suspended_until').eq('id', data.user.id).single();
        
        if (profile?.suspended_until && new Date(profile.suspended_until) > new Date()) {
          await signOut();
          const date = new Date(profile.suspended_until).toLocaleDateString() + ' ' + new Date(profile.suspended_until).toLocaleTimeString();
          toast({ 
            title: "⛔ Cuenta Suspendida", 
            description: `Tu cuenta está suspendida hasta el ${date}. Contacta al administrador.`, 
            variant: "destructive",
            duration: 8000
          });
        } else {
          navigate('/dashboard');
        }
      }
    } else {
      const role = formData.email === 'proyectcodecraft@gmail.com' ? 'admin' : formData.role;
      const options = {
        data: {
          name: formData.name,
          role: role,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`,
          skills: formData.role === 'developer' ? (formData.skills || '').split(',').map(s => s.trim()).filter(Boolean) : [],
          terms_accepted: true
        },
        emailRedirectTo: `${window.location.origin}/email-confirmed`
      };
      const { error } = await signUp(formData.email, formData.password, options);
      if (error) {
        toast({ title: "❌ Error de registro", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "✅ ¡Registro exitoso!", description: "Revisa tu correo para confirmar tu cuenta." });
        setIsLogin(true);
      }
    }
    setLoading(false);
  }, [formData, isLogin, signIn, signUp, signOut, navigate, toast]);

  const handleResetRequestSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!resetEmail.trim()) {
      setErrors({ resetEmail: 'El correo electrónico es obligatorio' });
      return;
    }
    
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Correo enviado", description: "Revisa tu bandeja de entrada para el enlace de reseteo." });
      setIsForgotPassword(false);
    }
    setLoading(false);
  }, [resetEmail, toast]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background pb-16">
      <SpaceBackground />
      <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="ghost" size="icon" className="absolute top-4 right-4 z-20 rounded-full bg-card/80 dark:bg-card/60 backdrop-blur-lg border border-border/20">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
      {isForgotPassword 
        ? <ForgotPasswordForm resetEmail={resetEmail} setResetEmail={setResetEmail} handleResetRequestSubmit={handleResetRequestSubmit} setIsForgotPassword={setIsForgotPassword} loading={loading} error={errors.resetEmail} /> 
        : <AuthForm isLogin={isLogin} formData={formData} handleInputChange={handleInputChange} handleMainSubmit={handleMainSubmit} setIsLogin={setIsLogin} setIsForgotPassword={setIsForgotPassword} loading={loading} errors={errors} setFormData={setFormData} />
      }
      <AuthFooter />
    </div>
  );
};

export default AuthPage;
