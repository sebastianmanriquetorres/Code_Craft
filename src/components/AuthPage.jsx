import React, { useState, useContext, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Star, Code, HelpCircle, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ThemeContext } from '@/context/ThemeContext';
import SpaceBackground from '@/components/SpaceBackground';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ isLogin, formData, handleInputChange, handleMainSubmit, setIsLogin, setIsForgotPassword, loading }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="relative z-10 bg-card/80 dark:bg-card/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-border/20">
      <div className="text-center mb-8">
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
        <h1 className="text-3xl font-bold text-foreground">{isLogin ? 'Bienvenido de Nuevo' : 'Crea tu Cuenta'}</h1>
        <p className="text-muted-foreground">{isLogin ? 'Accede a tu universo de proyectos.' : 'Únete a la galaxia de talentos.'}</p>
      </div>
      <form onSubmit={handleMainSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div className="relative"><User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" /><input type="text" name="name" placeholder="Nombre completo" value={formData.name} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" required /></div>
            <div className="relative"><Star className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" /><select name="role" value={formData.role} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg appearance-none focus:ring-2 focus:ring-primary/50 outline-none" required><option value="client">Soy un Cliente</option><option value="developer">Soy un Desarrollador</option></select></div>
            {formData.role === 'developer' && <div className="relative"><Code className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" /><input type="text" name="skills" placeholder="Habilidades (React, Node, etc.)" value={formData.skills} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" /></div>}
          </>
        )}
        <div className="relative"><Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" /><input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" required /></div>
        <div className="relative"><Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" /><input type="password" name="password" placeholder="Contraseña (mín. 6 caracteres)" value={formData.password} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" required /></div>
        {isLogin && <div className="text-right"><button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm text-primary hover:underline">¿Olvidaste tu contraseña?</button></div>}
        <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2.5 rounded-lg transition-transform transform hover:scale-105">{loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}</Button>
      </form>
      <div className="mt-6 text-center"><button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">{isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}</button></div>
    </motion.div>
  );
};

const ForgotPasswordForm = ({ resetEmail, setResetEmail, handleResetRequestSubmit, setIsForgotPassword, loading }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="relative z-10 bg-card/80 dark:bg-card/60 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-border/20">
    <div className="text-center mb-8"><HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" /><h1 className="text-3xl font-bold text-foreground">Restablecer Contraseña</h1><p className="text-muted-foreground">Ingresa tu correo para recibir un enlace.</p></div>
    <form onSubmit={handleResetRequestSubmit} className="space-y-4">
      <div className="relative"><Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" /><input type="email" placeholder="Correo electrónico" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" required /></div>
      <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2.5 rounded-lg">{loading ? 'Enviando...' : 'Enviar Enlace'}</Button>
    </form>
    <div className="mt-6 text-center"><button onClick={() => setIsForgotPassword(false)} className="text-sm text-primary hover:underline">Volver a Iniciar Sesión</button></div>
  </motion.div>
);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'client', skills: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMainSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        toast({ title: "❌ Cuenta inválida", description: "Revisa tu correo y contraseña.", variant: "destructive" });
      } else {
        navigate('/dashboard');
      }
    } else {
      const role = formData.email === 'proyectcodecraft@gmail.com' ? 'admin' : formData.role;
      const options = {
        data: {
          name: formData.name,
          role: role,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`,
          skills: formData.role === 'developer' ? (formData.skills || '').split(',').map(s => s.trim()).filter(Boolean) : [],
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
  }, [formData, isLogin, signIn, signUp, navigate, toast]);

  const handleResetRequestSubmit = useCallback(async (e) => {
    e.preventDefault();
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
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <SpaceBackground />
      <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="ghost" size="icon" className="absolute top-4 right-4 z-20 rounded-full bg-card/80 dark:bg-card/60 backdrop-blur-lg border border-border/20">
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
      {isForgotPassword 
        ? <ForgotPasswordForm resetEmail={resetEmail} setResetEmail={setResetEmail} handleResetRequestSubmit={handleResetRequestSubmit} setIsForgotPassword={setIsForgotPassword} loading={loading} /> 
        : <AuthForm isLogin={isLogin} formData={formData} handleInputChange={handleInputChange} handleMainSubmit={handleMainSubmit} setIsLogin={setIsLogin} setIsForgotPassword={setIsForgotPassword} loading={loading} />
      }
    </div>
  );
};

export default AuthPage;