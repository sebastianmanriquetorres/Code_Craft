import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MailCheck, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SpaceBackground from '@/components/SpaceBackground';

const EmailConfirmationPage = () => {
  return (
    <>
      <Helmet>
        <title>Email Confirmed - CodeCraft</title>
        <meta name="description" content="Your email has been successfully confirmed." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
        <SpaceBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative z-10 text-center p-10 rounded-2xl bg-card/80 dark:bg-card/60 backdrop-blur-lg w-full max-w-lg border border-border/20 shadow-2xl"
        >
          <MailCheck className="mx-auto h-20 w-20 text-green-500 mb-6" />
          <h1 className="text-4xl font-extrabold text-foreground mb-4">
            ¡Correo Confirmado!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Tu cuenta ha sido activada. ¡Ya puedes iniciar sesión y comenzar a explorar el universo de CodeCraft!
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/">
              <LogIn className="mr-2 h-5 w-5" />
              Ir a Iniciar Sesión
            </Link>
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default EmailConfirmationPage;