
import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsLeft, ChevronsRight, LayoutDashboard, Briefcase, Users, Star, Calendar, User, LogOut, Sun, Moon, Power, CreditCard, Package, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeContext } from '@/context/ThemeContext';
import ProfileEditor from '@/components/ProfileEditor';
import { useToast } from '@/components/ui/use-toast';
import SpaceBackground from '@/components/SpaceBackground';
import ShoppingCartComponent from '@/components/ShoppingCart';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const Layout = ({ children, currentUser, setCurrentUser, users, setUsers }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  const toggleAvailability = async () => {
    if (!currentUser) return;
    const isAvailable = !currentUser.available;
    const { data, error } = await supabase
      .from('profiles')
      .update({ available: isAvailable })
      .eq('id', currentUser.id)
      .select()
      .single();

    if (error) {
      toast({ title: "Error al actualizar disponibilidad", variant: "destructive" });
    } else {
      setCurrentUser(data);
      toast({ title: isAvailable ? "🟢 Disponible" : "🔴 No Disponible", description: isAvailable ? "Ahora aparecerás en la lista de desarrolladores." : "Ya no serás visible para nuevos clientes." });
    }
  };

  const baseNav = [
    { to: '/store', icon: Package, label: 'Plantillas' },
  ];

  const adminNav = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Resumen' },
    { to: '/users', icon: Users, label: 'Usuarios' },
    { to: '/projects', icon: Briefcase, label: 'Proyectos' },
    { to: '/calendar', icon: Calendar, label: 'Calendario' },
    ...baseNav,
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
      <ShoppingCartComponent isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      <SpaceBackground small />
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
            <NavLink key={item.to} to={item.to} end={item.to === '/dashboard' || item.to === '/'} className={({ isActive }) => `flex items-center gap-3 p-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
              <item.icon className="w-5 h-5" />
              <AnimatePresence>{isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{item.label}</motion.span>}</AnimatePresence>
            </NavLink>
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 border-b border-border/20 bg-card/50 backdrop-blur-sm">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isSidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}
          </Button>
          <div className="flex items-center gap-4">
            <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} variant="ghost" size="icon" id="theme-toggle-button">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button onClick={() => setIsCartOpen(true)} variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {totalCartItems}
                    </span>
                )}
            </Button>
            <img src={currentUser?.avatar} alt="avatar" className="w-9 h-9 rounded-full cursor-pointer" onClick={() => setShowProfileEditor(true)} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
