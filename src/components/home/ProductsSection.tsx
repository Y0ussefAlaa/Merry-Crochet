import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../product/ProductCard';
import { ProductGridSkeleton } from '../ui/SkeletonLoader';

interface ProductsSectionProps {
  onAddToCartToast?: (productName: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onAddToCartToast }) => {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 4) || [];

  return (
    // TODO: DASHBOARD DATA - Products list is fetched dynamically via useProducts() hook which syncs with Firestore / Dashboard products collection
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 text-center sm:text-left">
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-500 font-semibold">Featured Handcrafted Items</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream mt-1">
            Our Featured Products
          </h2>
          <p className="text-sm text-warmbrown-600 dark:text-darkbg-muted mt-1">
            Hand-selected customer favorites freshly made from our workshop.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 py-3 px-6 bg-sage-400 hover:bg-sage-500 text-white font-semibold rounded-2xl shadow-cozy text-sm transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCartToast={onAddToCartToast}
            />
          ))}
        </div>
      )}
    </section>
  );
};
