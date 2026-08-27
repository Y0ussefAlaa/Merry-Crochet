import React, { useState } from 'react';
import { HeroSection } from '../../components/home/HeroSection';
import { ProductsSection } from '../../components/home/ProductsSection';
import { AboutSection } from '../../components/home/AboutSection';
import { ContactSection } from '../../components/home/ContactSection';
import { ToastContainer, type ToastMessage } from '../../components/ui/Toast';

export const Home: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleAddToCartToast = (productName: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title: 'Added to Cart', message: `${productName} added to your shopping bag.` }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    // Single cohesive landing page composed of modular sections with smooth scroll navigation
    <div className="space-y-12 sm:space-y-16 pb-12">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Hero Section Component */}
      <HeroSection />

      {/* Featured Products Section Component */}
      <ProductsSection onAddToCartToast={handleAddToCartToast} />

      {/* About Section Component */}
      <AboutSection />

      {/* Contact Us Section Component */}
      <ContactSection />
    </div>
  );
};
