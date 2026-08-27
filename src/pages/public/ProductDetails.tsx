import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Plus, Minus, ShieldCheck, Truck } from 'lucide-react';
import { useProduct, useProducts } from '../../hooks/useProducts';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency, getAvailabilityBadgeStyle, getAvailabilityLabel } from '../../utils/formatters';
import { ProductDetailsSkeleton } from '../../components/ui/SkeletonLoader';
import { ToastContainer, type ToastMessage } from '../../components/ui/Toast';
import { ProductCard } from '../../components/product/ProductCard';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError } = useProduct(id);
  const { data: allProducts } = useProducts();

  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">Product Not Found</h2>
        <p className="text-sm text-warmbrown-600 dark:text-darkbg-muted">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 py-3 px-6 bg-sage-400 text-white rounded-2xl font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.availability === 'out-of-stock';

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem(product, quantity);

    const toastId = Date.now().toString();
    setToasts((prev) => [
      ...prev,
      {
        id: toastId,
        title: 'Added to Cart',
        message: `${quantity}x ${product.name} added to your cart.`,
      },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 3000);
  };

  const relatedProducts = allProducts
    ?.filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-warmbrown-600 dark:text-darkbg-muted hover:text-sage-600 dark:hover:text-sage-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Product Image */}
        <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border shadow-cozy">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover object-center"
          />
          <div className="absolute top-4 left-4 z-10">
            <span
              className={`inline-block px-4 py-1.5 text-xs font-semibold rounded-full border backdrop-blur-md shadow-sm ${getAvailabilityBadgeStyle(
                product.availability
              )}`}
            >
              {getAvailabilityLabel(product.availability)}
            </span>
          </div>
        </div>

        {/* Right: Product Meta & Add to Cart Controls */}
        <div className="space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-sage-600 dark:text-sage-400 font-bold">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
              {product.name}
            </h1>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-rose-500 dark:text-rose-300 pt-1">
              {formatCurrency(product.price)}
            </div>
            <p className="text-sm sm:text-base text-warmbrown-700 dark:text-darkbg-muted leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Stock & Availability Info */}
          <div className="p-4 bg-cream-50 dark:bg-darkbg-surface rounded-2xl border border-cream-200/80 dark:border-darkbg-border/80 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between items-center">
              <span className="text-warmbrown-600 dark:text-darkbg-muted">Status:</span>
              <span className="font-semibold text-warmbrown-800 dark:text-darkbg-cream">
                {getAvailabilityLabel(product.availability)}
              </span>
            </div>
            {product.stock > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-warmbrown-600 dark:text-darkbg-muted">Stock Remaining:</span>
                <span className="font-semibold text-warmbrown-800 dark:text-darkbg-cream">
                  {product.stock} units
                </span>
              </div>
            )}
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-warmbrown-700 dark:text-darkbg-cream">Quantity:</span>
              <div className="flex items-center bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border rounded-2xl p-1 shadow-sm">
                <button
                  onClick={handleDecrease}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 text-warmbrown-600 hover:text-warmbrown-900 dark:text-darkbg-muted dark:hover:text-white disabled:opacity-30 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-warmbrown-800 dark:text-darkbg-cream">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  disabled={isOutOfStock}
                  className="p-2 text-warmbrown-600 hover:text-warmbrown-900 dark:text-darkbg-muted dark:hover:text-white disabled:opacity-30 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 px-6 rounded-2xl text-base font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
                isOutOfStock
                  ? 'bg-gray-300 dark:bg-darkbg-surface text-gray-500 cursor-not-allowed'
                  : 'bg-sage-400 hover:bg-sage-500 text-white shadow-cozy hover:shadow-cozy-lg transform active:scale-[0.99]'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{isOutOfStock ? 'Currently Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>

          {/* Extra Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-cream-200 dark:border-darkbg-border text-xs text-warmbrown-600 dark:text-darkbg-muted">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sage-500" />
              <span>Pure Cotton Yarn</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-sage-500" />
              <span>Packed with Care</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-cream-200 dark:border-darkbg-border space-y-6">
          <h3 className="text-2xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
            You May Also Love
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
