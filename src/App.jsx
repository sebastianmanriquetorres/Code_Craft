import React, { useEffect, useContext, useCallback, useState } from 'react';
    import { Helmet } from 'react-helmet';
    import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useToast } from '@/components/ui/use-toast';
    import AuthPage from '@/components/AuthPage';
    import Layout from '@/components/Layout';
    import AdminDashboard from '@/components/AdminDashboard';
    import ClientDashboard from '@/components/ClientDashboard';
    import DeveloperDashboard from '@/components/DeveloperDashboard';
    import ResetPasswordPage from '@/components/ResetPasswordPage';
    import { ThemeContext } from '@/context/ThemeContext';
    import LoadingScreen from '@/components/LoadingScreen';
    import UsersPage from '@/components/UsersPage';
    import ProjectsPage from '@/components/ProjectsPage';
    import CalendarPage from '@/components/CalendarPage';
    import DevelopersPage from '@/components/DevelopersPage';
    import ReviewsPage from '@/components/ReviewsPage';
    import ChatWidget from '@/components/ChatWidget';
    import ThemeTransition from '@/components/ThemeTransition';
    import PaymentPage from '@/components/PaymentPage';
    import StorePage from '@/pages/StorePage';
    import ProductDetailPage from '@/pages/ProductDetailPage';
    import SuccessPage from '@/pages/SuccessPage';
    import EmailConfirmationPage from '@/pages/EmailConfirmationPage';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { supabase } from '@/lib/customSupabaseClient';

    function App() {
      const { session, user, loading: authLoading } = useAuth();
      const [users, setUsers] = useState([]);
      const [projects, setProjects] = useState([]);
      const [proposals, setProposals] = useState([]);
      const [reviews, setReviews] = useState([]);
      const [messages, setMessages] = useState([]);
      const [devTemplates, setDevTemplates] = useState([]);
      const [currentUser, setCurrentUser] = useState(null);
      const { theme } = useContext(ThemeContext);
      const [appLoading, setAppLoading] = useState(true);

      const { toast } = useToast();
      const location = useLocation();

      useEffect(() => {
        const timer = setTimeout(() => setAppLoading(false), 1500);
        return () => clearTimeout(timer);
      }, []);

      useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      }, [theme]);

      const fetchData = useCallback(async () => {
        if (!user) return;
        
        const [
            { data: profilesData, error: profilesError },
            { data: projectsData, error: projectsError },
            { data: proposalsData, error: proposalsError },
            { data: reviewsData, error: reviewsError },
            { data: messagesData, error: messagesError },
            { data: templatesData, error: templatesError }
        ] = await Promise.all([
            supabase.from('profiles').select('*'),
            supabase.from('projects').select('*'),
            supabase.from('proposals').select('*'),
            supabase.from('reviews').select('*'),
            supabase.from('messages').select('*'),
            supabase.from('dev_templates').select('*')
        ]);

        if (profilesError) console.error('Error fetching profiles:', profilesError); else setUsers(profilesData || []);
        if (projectsError) console.error('Error fetching projects:', projectsError); else setProjects(projectsData || []);
        if (proposalsError) console.error('Error fetching proposals:', proposalsError); else setProposals(proposalsData || []);
        if (reviewsError) console.error('Error fetching reviews:', reviewsError); else setReviews(reviewsData || []);
        if (messagesError) console.error('Error fetching messages:', messagesError); else setMessages(messagesData || []);
        if (templatesError) console.error('Error fetching templates:', templatesError); else setDevTemplates(templatesData || []);

      }, [user]);

      useEffect(() => {
        if (session) {
          fetchData();
        }
      }, [session, fetchData]);

      useEffect(() => {
        if (user && users.length > 0) {
          const profile = users.find(p => p.id === user.id);
          setCurrentUser(profile || null);
        } else if (user && users.length === 0 && !authLoading) {
          const findProfile = async () => {
            const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (data) setCurrentUser(data);
          };
          findProfile();
        } else {
          setCurrentUser(null);
        }
      }, [user, users, authLoading]);

      useEffect(() => {
        const handleChanges = (setFunction) => (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          setFunction(currentData => {
            if (eventType === 'INSERT') {
              return [...currentData, newRecord];
            }
            if (eventType === 'UPDATE') {
              return currentData.map(item => item.id === newRecord.id ? newRecord : item);
            }
            if (eventType === 'DELETE') {
              return currentData.filter(item => item.id !== oldRecord.id);
            }
            return currentData;
          });
        };

        const channels = supabase.channel('realtime-all')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
              handleChanges(setProjects)(payload);
              if(payload.eventType === 'UPDATE' && payload.new.progress === 100){
                 toast({ title: '¡Proyecto completado!', description: `El proyecto "${payload.new.title}" está listo para ser revisado.` });
              }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, handleChanges(setUsers))
          .on('postgres_changes', { event: '*', schema: 'public', table: 'proposals' }, (payload) => {
              handleChanges(setProposals)(payload);
              const { new: newRecord, eventType } = payload;
              if (eventType === 'INSERT' && user) {
                  const project = projects.find(p => p.id === newRecord.project_id);
                  if (project && project.client_id === user.id) {
                      toast({ title: '¡Nueva propuesta recibida!', description: `Has recibido una nueva propuesta para "${project.title}".` });
                  }
              }
               if (eventType === 'UPDATE' && newRecord.status === 'accepted' && user) {
                  const project = projects.find(p => p.id === newRecord.project_id);
                  if (project && newRecord.developer_id === user.id) {
                      toast({ title: '¡Propuesta aceptada!', description: `Tu propuesta para "${project.title}" por ${newRecord.price} ha sido aceptada. ¡Ya puedes comenzar a trabajar!` });
                  }
              }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, handleChanges(setReviews))
          .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, handleChanges(setMessages))
          .on('postgres_changes', { event: '*', schema: 'public', table: 'dev_templates' }, handleChanges(setDevTemplates))
          .subscribe();

        return () => {
          supabase.removeChannel(channels);
        };
      }, [projects, user, toast]);

      const commonProps = { currentUser, setCurrentUser, users, setUsers, projects, setProjects, proposals, setProposals, reviews, setReviews, messages, setMessages, devTemplates, setDevTemplates };

      if (authLoading || appLoading) {
        return <LoadingScreen />;
      }

      return (
        <>
          <Helmet>
            <title>Code_Craft</title>
            <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E💡%3C/text%3E%3C/svg%3E" />
          </Helmet>
          
          <ThemeTransition />
          <div className="min-h-screen bg-background text-foreground">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {!session ? (
                  <>
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/email-confirmed" element={<EmailConfirmationPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </>
                ) : (
                  <Route path="/*" element={
                    <Layout {...commonProps}>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={currentUser?.role === 'admin' ? <AdminDashboard {...commonProps} /> : currentUser?.role === 'client' ? <ClientDashboard {...commonProps} /> : <DeveloperDashboard {...commonProps} />} />
                        <Route path="/projects" element={currentUser?.role === 'admin' ? <ProjectsPage {...commonProps} /> : <Navigate to="/dashboard" />} />
                        <Route path="/developers" element={<DevelopersPage {...commonProps} />} />
                        <Route path="/reviews" element={<ReviewsPage {...commonProps} />} />
                        <Route path="/calendar" element={<CalendarPage {...commonProps} />} />
                        <Route path="/users" element={<UsersPage {...commonProps} />} />
                        <Route path="/payments" element={<PaymentPage {...commonProps} />} />
                        <Route path="/store" element={<StorePage {...commonProps} />} />
                        <Route path="/product/:id" element={<ProductDetailPage {...commonProps} />} />
                        <Route path="/success" element={<SuccessPage />} />
                        <Route path="*" element={<div className="p-4">Página no encontrada</div>} />
                      </Routes>
                    </Layout>
                  }/>
                )}
              </Routes>
            </AnimatePresence>
            {currentUser && <ChatWidget {...commonProps} />}
          </div>
        </>
      );
    }

    export default App;