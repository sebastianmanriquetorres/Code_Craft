
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessPage = () => {
  return (
    <>
      <Helmet>
        <title>Payment Successful - CodeCraft</title>
        <meta name="description" content="Your payment was successful." />
      </Helmet>
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center p-10 rounded-xl glass-card max-w-lg"
        >
          <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
          <h1 className="text-4xl font-extrabold text-foreground mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your purchase. Your order is being processed and you will receive a confirmation email shortly.
          </p>
          <Button asChild size="lg">
            <Link to="/store">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default SuccessPage;
