import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/ui/EmptyState';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = items.length > 0 ? 50 : 0; // Mock delivery fee 50 EGP
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState type="cart" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header & Back Link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-200 dark:border-darkbg-border pb-6">
        <div>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-warmbrown-600 dark:text-darkbg-muted hover:text-sage-600 dark:hover:text-sage-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </button>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
            Shopping Cart
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Clear Entire Cart
        </button>
      </div>

      {/* Main Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            >
              {/* Product Image */}
              <Link to={`/products/${product.id}`} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-cream-100 dark:bg-darkbg-surface flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 space-y-1 text-center sm:text-left w-full">
                <span className="text-[10px] uppercase tracking-wider text-sage-600 dark:text-sage-400 font-bold">
                  {product.category}
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-warmbrown-800 dark:text-darkbg-cream line-clamp-1">
                  <Link to={`/products/${product.id}`}>{product.name}</Link>
                </h3>
                <p className="text-xs text-rose-500 dark:text-rose-300 font-semibold font-sans">
                  {formatCurrency(product.price)} each
                </p>
              </div>

              {/* Quantity Controls & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-cream-100 dark:border-darkbg-border/60">
                {/* Quantity Buttons */}
                <div className="flex items-center bg-cream-100 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border rounded-2xl p-1">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="p-1.5 text-warmbrown-600 dark:text-darkbg-muted hover:text-warmbrown-900 dark:hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-warmbrown-800 dark:text-darkbg-cream">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="p-1.5 text-warmbrown-600 dark:text-darkbg-muted hover:text-warmbrown-900 dark:hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Item Subtotal */}
                <div className="text-right min-w-[80px]">
                  <span className="text-xs text-warmbrown-500 dark:text-darkbg-muted block sm:hidden">Total</span>
                  <span className="text-base font-bold text-warmbrown-800 dark:text-darkbg-cream">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>

                {/* Remove Item Button */}
                <button
                  onClick={() => removeItem(product.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-4 bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-6 shadow-cozy space-y-6 sticky top-28">
          <h2 className="text-xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream pb-3 border-b border-cream-100 dark:border-darkbg-border">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-warmbrown-600 dark:text-darkbg-muted">
              <span>Subtotal ({items.length} items)</span>
              <span className="font-semibold text-warmbrown-800 dark:text-darkbg-cream">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex justify-between text-warmbrown-600 dark:text-darkbg-muted">
              <span>Delivery Fee</span>
              <span className="font-semibold text-warmbrown-800 dark:text-darkbg-cream">{formatCurrency(deliveryFee)}</span>
            </div>

            <div className="p-3 bg-cream-100/70 dark:bg-darkbg-surface rounded-2xl flex items-start gap-2 text-xs text-warmbrown-600 dark:text-darkbg-muted">
              <Info className="w-4 h-4 text-sage-600 dark:text-sage-400 flex-shrink-0 mt-0.5" />
              <span>Delivery fee will be confirmed with you via phone/WhatsApp after order placement.</span>
            </div>

            <div className="pt-3 border-t border-cream-200 dark:border-darkbg-border flex justify-between items-end">
              <div>
                <span className="text-xs text-warmbrown-500 dark:text-darkbg-muted block">Total Price</span>
                <span className="text-2xl font-bold font-sans text-rose-500 dark:text-rose-300">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full py-4 px-6 bg-sage-400 hover:bg-sage-500 text-white font-bold rounded-2xl shadow-cozy hover:shadow-cozy-lg transition-all duration-300 flex items-center justify-center gap-2 text-base"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
