import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../components/product/ProductCard';
import { ProductGridSkeleton } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';
import { ToastContainer, type ToastMessage } from '../../components/ui/Toast';

export const Products: React.FC = () => {
  // TODO: DASHBOARD DATA - Fetch products list from Firestore products collection in Stage 2
  const { data: products, isLoading, isError } = useProducts();

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddToCartToast = (productName: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title: 'Added to Cart', message: `${productName} added to your shopping bag.` }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Filter ONLY by product name search
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchTerm.trim()) return products;

    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [products, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
          All Handmade Creations
        </h1>
        <p className="text-sm sm:text-base text-warmbrown-600 dark:text-darkbg-muted leading-relaxed">
          Browse our full collection of handmade crochet items.
        </p>
      </div>

      {/* Search Input Bar (No Categories, No Filters - Search by Name Only) */}
      <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-4 shadow-sm flex items-center justify-center max-w-xl mx-auto">
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-warmbrown-500 dark:text-darkbg-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name..."
            className="w-full pl-12 pr-10 py-3 bg-cream-100 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border-none focus:ring-2 focus:ring-sage-400 outline-none transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main All Products Grid */}
      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : isError ? (
        <div className="p-8 text-center text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-3xl">
          Unable to load products. Please try again.
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          type="products"
          title="No products match your search"
          description="Try searching with a different product name."
          actionText="Clear Search"
          onActionClick={() => setSearchTerm('')}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCartToast={handleAddToCartToast}
            />
          ))}
        </div>
      )}
    </div>
  );
};
