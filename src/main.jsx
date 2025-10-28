
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import { BrowserRouter } from 'react-router-dom';
    import App from '@/App';
    import '@/index.css';
    import { ThemeProvider } from '@/context/ThemeContext';
    import { CartProvider } from '@/hooks/useCart';
    import { AuthProvider } from '@/contexts/SupabaseAuthContext';
    import { Toaster } from "@/components/ui/toaster";

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <App />
                <Toaster />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  