
import React, { useState, useContext, useCallback, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, LayoutDashboard, Briefcase, Users, Star, Calendar, User, LogOut, Sun, Moon, Power, CreditCard, Package, Heart, Book, Bell, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeContext } from '@/context/ThemeContext';
import ProfileEditor from '@/components/ProfileEditor';
import { useToast } from '@/components/ui/use-toast';
import SpaceBackground from '@/components/SpaceBackground';
import ShoppingCartComponent from '@/components/ShoppingCart';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useIdleTimer } from '@/hooks/useIdleTimer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TermsText, PrivacyText } from '@/components/LegalTexts';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Layout = ({ children, currentUser, setCurrentUser, users, setUsers }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleIdle = useCallback(() => {
    signOut({ fromIdle: true });
    navigate('/');
  }, [signOut, navigate]);

  useIdleTimer(handleIdle, 1000 * 60 * 15);

  // Fetch notifications
  useEffect(() => {
    if (!currentUser) return;
    
    const fetchNotifs = async () => {
        const { data } = await supabase.from('internal_notifications')
            .select('*')
            .eq('recipient_id', currentUser.id)
            .order('created_at', { ascending: false })
            .limit(10);
        if (data) setNotifications(data);
    };

    fetchNotifs();

    const channel = supabase.channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'internal_notifications', filter: `recipient_id=eq.${currentUser.id}` }, (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          toast({ title: "Nueva Notificación", description: "Has recibido un mensaje del administrador." });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [currentUser, toast]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  const toggleAvailability = async () => {
    if (!currentUser) return;
    const isAvailable = !currentUser.available;
    setCurrentUser(prev => ({ ...prev, available: isAvailable }));
    
    const { error } = await supabase
      .from('profiles')
      .update({ available: isAvailable })
      .eq('id', currentUser.id);

    if (error) {
      setCurrentUser(prev => ({ ...prev, available: !isAvailable }));
      toast({ title: "Error al actualizar disponibilidad", variant: "destructive" });
    } else {
      toast({ title: isAvailable ? "🟢 Disponible" : "🔴 No Disponible", description: isAvailable ? "Ahora aparecerás en la lista de desarrolladores." : "Ya no serás visible para nuevos clientes." });
    }
  };

  const baseNav = [
    { to: '/store', icon: Package, label: 'Plantillas' },
    { to: 'https://drive.google.com/drive/folders/1e5f6ioQmZqgeT_c4LXzgPjmBxc8IzAt1?usp=sharing', icon: Book, label: 'Manuales', external: true },
  ];

  const adminNav = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Resumen' },
    { to: '/users', icon: Users, label: 'Usuarios' },
    { to: '/projects', icon: Briefcase, label: 'Proyectos' },
    { to: '/calendar', icon: Calendar, label: 'Calendario' },
    ...baseNav,
    { to: '/monitoring', icon: Activity, label: 'Monitoreo' }, // Explicitly added here
  ];

  const clientNav = [
    { to: '/dashboard', icon: Briefcase, label: 'Mis Proyectos' },
    { to: '/developers', icon: Users, label: 'Desarrolladores' },
    { to: '/payments', icon: CreditCard, label: 'Pagar Proyectos' },
    { to: '/calendar', icon: Calendar, label: 'Calendario' },
    ...baseNav,
  ];

  const devNav = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Panel' },
    { to: '/reviews', icon: Star, label: 'Reseñas' },
    { to: '/calendar', icon: Calendar, label: 'Calendario' },
    ...baseNav,
  ];

  const navItems = currentUser?.role === 'admin' ? adminNav : currentUser?.role === 'client' ? clientNav : devNav;

  return (
    <div className="flex h-screen bg-background">
      <AnimatePresence>{showProfileEditor && <ProfileEditor user={currentUser} onClose={() => setShowProfileEditor(false)} />}</AnimatePresence>
      <ShoppingCartComponent isCartOpen={isFavoritesOpen} setIsCartOpen={setIsFavoritesOpen} />
      <SpaceBackground small />
      
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

      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className="relative z-20 flex flex-col bg-card/80 backdrop-blur-sm border-r border-border/20 transition-width duration-300"
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-border/20">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 100 100">
                  <path d="M50 10 C 30 10, 20 30, 20 50 C 20 70, 30 90, 50 90 C 70 90, 80 70, 80 50 C 80 30, 70 10, 50 10 Z" fill={theme === 'dark' ? '#fde047' : '#facc15'} />
                </svg>
                <span className="font-bold text-lg">CodeCraft</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            item.external ? (
              <a 
                key={item.to} 
                href={item.to} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-accent"
              >
                <item.icon className="w-5 h-5" />
                <AnimatePresence>{isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{item.label}</motion.span>}</AnimatePresence>
              </a>
            ) : (
              <NavLink 
                key={item.to} 
                to={item.to} 
                end={item.to === '/dashboard' || item.to === '/'} 
                className={({ isActive }) => `flex items-center gap-3 p-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              >
                <item.icon className="w-5 h-5" />
                <AnimatePresence>{isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{item.label}</motion.span>}</AnimatePresence>
              </NavLink>
            )
          ))}
        </nav>
        <div className="p-4 border-t border-border/20 space-y-2">
          {currentUser?.role === 'developer' && (
            <Button onClick={toggleAvailability} variant="outline" className={`w-full justify-start gap-3 ${currentUser.available ? 'text-green-500 border-green-500 hover:bg-green-500/10 hover:text-green-500' : 'text-red-500 border-red-500 hover:bg-red-500/10 hover:text-red-500'}`}>
              <Power className="w-5 h-5" />
              <AnimatePresence>{isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{currentUser.available ? 'Disponible' : 'No Disponible'}</motion.span>}</AnimatePresence>
            </Button>
          )}
          <Button onClick={() => setShowProfileEditor(true)} variant="ghost" className="w-full justify-start gap-3">
            <User className="w-5 h-5" />
            <AnimatePresence>{isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Perfil</motion.span>}</AnimatePresence>
          </Button>
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-500 hover:bg-red-500/10">
            <LogOut className="w-5 h-5" />
            <AnimatePresence>{isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Salir</motion.span>}</AnimatePresence>
          </Button>
        </div>
      </motion.aside>
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="flex items-center justify-between h-16 px-6 border-b border-border/20 bg-card/50 backdrop-blur-sm">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isSidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}
          </Button>
          <div className="flex items-center gap-4">
             <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {notifications.filter(n => !n.read).length > 0 && (
                            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive animate-pulse"></span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="space-y-2">
                        <h4 className="font-semibold border-b pb-2">Notificaciones</h4>
                        {notifications.length === 0 ? <p className="text-sm text-muted-foreground">No tienes notificaciones nuevas.</p> : (
                            <div className="max-h-60 overflow-y-auto space-y-2">
                                {notifications.map(n => (
                                    <div key={n.id} className="text-sm p-2 bg-secondary/20 rounded">
                                        <p>{n.message}</p>
                                        <span className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="ghost" size="icon" id="theme-toggle-button">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button onClick={() => setIsFavoritesOpen(true)} variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
            </Button>
            <img src={currentUser?.avatar} alt="avatar" className="w-9 h-9 rounded-full cursor-pointer" onClick={() => setShowProfileEditor(true)} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 pb-24">
          {children}
        </main>
        <footer className="absolute bottom-0 w-full bg-card border-t py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
            <span>© 2025 Code_Craft</span>
            <span className="hidden md:inline">•</span>
            <span>proyectcodecraft@gmail.com</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowTerms(true)} className="hover:text-primary hover:underline">Términos y Condiciones</button>
            <span>|</span>
            <button onClick={() => setShowPrivacy(true)} className="hover:text-primary hover:underline">Privacidad</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
