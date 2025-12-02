
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SpaceBackground from '@/components/SpaceBackground';

const EmailConfirmationPage = () => {
  return (
    <>
      <Helmet>
        <title>Cuenta Activada - CodeCraft</title>
        <meta name="description" content="Tu cuenta ha sido activada exitosamente." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
        <SpaceBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative z-10 text-center p-10 rounded-2xl bg-card/80 dark:bg-card/60 backdrop-blur-lg w-full max-w-lg border border-border/20 shadow-2xl"
        >
          <CheckCircle2 className="mx-auto h-20 w-20 text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            ¡Tu cuenta ha sido activada exitosamente!
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Gracias por ser parte de Code_Craft. Ahora puedes iniciar sesión y comenzar a crear tus proyectos.
          </p>
          <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg py-6">
            <Link to="/">
              <LogIn className="mr-2 h-5 w-5" />
              Ir al inicio de sesión
            </Link>
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default EmailConfirmationPage;
