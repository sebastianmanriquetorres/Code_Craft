import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Falló el registro",
        description: error.message || "Algo salió mal",
      });
    }

    return { data, error };
  }, [toast]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Falló el inicio de sesión",
        description: error.message || "Algo salió mal",
      });
    }

    return { data, error };
  }, [toast]);

  const signOut = useCallback(async (options = {fromIdle: false}) => {
    if (options.fromIdle) {
      sessionStorage.setItem('idleTimeout', 'true');
    }

    // Check if there's an active session before trying to sign out
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession) {
        // If no session, just clear local state and avoid calling signOut
        setUser(null);
        setSession(null);
        if (options.fromIdle) {
            sessionStorage.removeItem('idleTimeout');
        }
        return { error: null };
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      // Ignore "session not found" errors as they are expected in some cases (e.g., idle timeout)
      if (error.code !== 403 && error.error_code !== 'session_not_found') {
        toast({
          variant: "destructive",
          title: "Falló el cierre de sesión",
          description: error.message || "Algo salió mal",
        });
      }
      if (options.fromIdle) {
          sessionStorage.removeItem('idleTimeout');
      }
    }

    return { error };
  }, [toast]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};