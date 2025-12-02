
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const StripePaymentForm = ({ amount, onSuccess, onCancel, loading: parentLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    const card = elements.getElement(CardElement);

    if (card == null) {
      setProcessing(false);
      return;
    }

    // Use createPaymentMethod for a more modern approach, or createToken.
    // Since we don't have a real backend to handle the payment intent secret,
    // we will simulate the "success" after a successful Stripe validation (token creation).
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else {
      setError(null);
      // Simulate backend processing time
      setTimeout(() => {
        onSuccess(paymentMethod);
        setProcessing(false);
      }, 1500);
    }
  };

  const isBusy = processing || parentLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border rounded-md bg-background">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
      
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel} disabled={isBusy}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1 bg-[#635bff] hover:bg-[#544ee0] text-white" disabled={!stripe || isBusy}>
            {isBusy ? (
                <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Procesando...
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Pagar ${amount}
                </span>
            )}
        </Button>
      </div>
      <div className="flex justify-center items-center gap-2 text-xs text-muted-foreground mt-2">
          <Lock className="w-3 h-3" /> Pagos seguros encriptados por Stripe
      </div>
    </form>
  );
};

export default StripePaymentForm;
