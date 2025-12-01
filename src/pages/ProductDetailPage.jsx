import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, Loader2, ArrowLeft, CheckCircle, Minus, Plus, XCircle, ChevronLeft, ChevronRight, FileCode, ExternalLink } from 'lucide-react';
import CreateProjectForm from '@/components/CreateProjectForm';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

function ProductDetailPage({ currentUser, setProjects }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [showCreateProject, setShowCreateProject] = useState(false);

  const handleAddToCart = useCallback(async () => {
    if (product && selectedVariant) {
      const availableQuantity = selectedVariant.inventory_quantity;
      try {
        await addToCart(product, selectedVariant, quantity, availableQuantity);
        toast({
          title: "Added to Cart! 🛒",
          description: `${quantity} x ${product.title} (${selectedVariant.title}) added.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Oh no! Something went wrong.",
          description: error.message,
        });
      }
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  const handleCreateProjectFromTemplate = () => {
    setShowCreateProject(true);
  };

  const handleProjectSubmit = (projectData) => {
    const project = { 
      id: Date.now(), 
      ...projectData, 
      clientId: currentUser.id, 
      developerId: null, 
      progress: 0, 
      createdAt: new Date().toISOString(), 
      proposals: [], 
      status: 'open', 
      chat: [],
      templateReference: { id: product.id, title: product.title, image: product.image }
    };
    setProjects(prev => [...prev, project]);
    setShowCreateProject(false);
    toast({ title: "🚀 Proyecto Creado", description: "Tu solicitud basada en la plantilla está ahora visible para los desarrolladores." });
    navigate('/dashboard');
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let fetchedProduct;
        const localTemplates = JSON.parse(localStorage.getItem('local_templates') || '[]');
        const localTemplate = localTemplates.find(t => t.id === id);

        if (localTemplate) {
          fetchedProduct = localTemplate;
        } else {
          fetchedProduct = await getProduct(id);
          const quantitiesResponse = await getProductQuantities({
            fields: 'inventory_quantity',
            product_ids: [fetchedProduct.id]
          });
          const variantQuantityMap = new Map();
          quantitiesResponse.variants.forEach(variant => {
            variantQuantityMap.set(variant.id, variant.inventory_quantity);
          });
          fetchedProduct.variants = fetchedProduct.variants.map(variant => ({
            ...variant,
            inventory_quantity: variantQuantityMap.get(variant.id) ?? variant.inventory_quantity
          }));
        }

        setProduct(fetchedProduct);
        if (fetchedProduct.variants && fetchedProduct.variants.length > 0) {
          setSelectedVariant(fetchedProduct.variants[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="h-16 w-16 text-foreground animate-spin" /></div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-5xl mx-auto text-center text-red-500 p-8">
        <p>Error: {error || "Plantilla no encontrada."}</p>
        <Button asChild variant="link"><Link to="/store">Volver a Plantillas</Link></Button>
      </div>
    );
  }

  const price = selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted;
  const originalPrice = selectedVariant?.price_formatted;
  const isTemplate = product.isTemplate;

  return (
    <>
      <Helmet>
        <title>{product.title} - CodeCraft</title>
        <meta name="description" content={product.subtitle || product.title} />
      </Helmet>
      <AnimatePresence>
        {showCreateProject && (
          <CreateProjectForm 
            onClose={() => setShowCreateProject(false)} 
            onSubmit={handleProjectSubmit}
            template={product}
          />
        )}
      </AnimatePresence>
      <div className="max-w-5xl mx-auto">
        <Link to="/store" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft size={16} />
          Volver a Plantillas
        </Link>
        <div className="grid md:grid-cols-2 gap-8 glass-card p-8 rounded-2xl">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <img src={product.image || placeholderImage} alt={product.title} className="w-full h-96 md:h-[500px] object-cover rounded-lg shadow-2xl" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col">
            <h1 className="text-4xl font-bold text-foreground mb-2">{product.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">{product.subtitle}</p>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-primary">{price}</span>
              {selectedVariant?.sale_price_in_cents && <span className="text-2xl text-muted-foreground line-through">{originalPrice}</span>}
            </div>
            <div className="prose prose-invert text-muted-foreground mb-6" dangerouslySetInnerHTML={{ __html: product.description || '' }} />
            
            {product.demo_link && (
              <a href={product.demo_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline mb-6">
                Ver Demo <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}

            <div className="mt-auto space-y-4">
              {currentUser.role === 'client' && (
                <Button onClick={handleCreateProjectFromTemplate} size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold py-3 text-lg">
                  <FileCode className="mr-2 h-5 w-5" /> Generar Solicitud con esta Plantilla
                </Button>
              )}
              <Button onClick={handleAddToCart} size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 text-lg">
                <ShoppingCart className="mr-2 h-5 w-5" /> Comprar Código ({price})
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;