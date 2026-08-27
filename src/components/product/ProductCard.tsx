import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatCurrency, getAvailabilityBadgeStyle, getAvailabilityLabel } from '../../utils/formatters';
import { useCartStore } from '../../store/cartStore';

interface ProductCardProps {
  product: Product;
  onAddToCartToast?: (productName: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCartToast }) => {
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.availability === 'out-of-stock';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem(product, 1);
    if (onAddToCartToast) {
      onAddToCartToast(product.name);
    }
  };

  return (
    <div className="group relative bg-white dark:bg-darkbg-card border border-cream-200/80 dark:border-darkbg-border rounded-3xl overflow-hidden shadow-sm hover:shadow-cozy-lg transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image & Quick Action Badge */}
      <div className="relative aspect-square overflow-hidden bg-cream-100 dark:bg-darkbg-surface">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Availability Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md shadow-sm ${getAvailabilityBadgeStyle(
              product.availability
            )}`}
          >
            {getAvailabilityLabel(product.availability)}
          </span>
        </div>

        {/* Overlay Action Button on Hover */}
        <div className="absolute inset-0 bg-warmbrown-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Link
            to={`/products/${product.id}`}
            className="p-3 bg-white/90 dark:bg-darkbg-card/90 text-warmbrown-800 dark:text-darkbg-cream rounded-full hover:bg-sage-400 hover:text-white dark:hover:bg-sage-500 transition-all duration-200 shadow-md transform translate-y-2 group-hover:translate-y-0"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider text-sage-600 dark:text-sage-400 font-semibold">
            {product.category}
          </span>
          <h3 className="mt-1 font-serif text-base sm:text-lg font-bold text-warmbrown-800 dark:text-darkbg-cream line-clamp-1 group-hover:text-sage-600 dark:group-hover:text-sage-300 transition-colors">
            <Link to={`/products/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="mt-1 text-xs text-warmbrown-600 dark:text-darkbg-muted line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="mt-4 pt-3 border-t border-cream-100 dark:border-darkbg-border/60 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-warmbrown-500 dark:text-darkbg-muted block">Price</span>
            <span className="text-base sm:text-lg font-bold font-sans text-rose-500 dark:text-rose-300">
              {formatCurrency(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center gap-1.5 py-2.5 px-3.5 sm:px-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
              isOutOfStock
                ? 'bg-gray-200 dark:bg-darkbg-surface text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-sage-400 hover:bg-sage-500 active:scale-95 text-white shadow-sm hover:shadow-cozy'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
