import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Phone, MapPin, FileText, ShoppingBag, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useCreateOrder } from '../../hooks/useOrders';
import { formatCurrency, isValidEgyptianPhone } from '../../utils/formatters';
import { SuccessModal } from '../../components/order/SuccessModal';
import type { Order } from '../../types/order';

// Validation Schema with Zod (strictly enforcing Egyptian phone numbers)
const checkoutSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (val) => isValidEgyptianPhone(val),
      'Please enter a valid Egyptian phone number (e.g. 01012345678 or +201001234567)'
    ),
  address: z.string().min(5, 'Delivery address must be at least 5 characters'),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const createOrderMutation = useCreateOrder();

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const deliveryFee = items.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  if (items.length === 0 && !isSuccessModalOpen) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">Your Cart is Empty</h2>
        <p className="text-sm text-warmbrown-600 dark:text-darkbg-muted">Please add items to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 py-3 px-6 bg-sage-400 text-white rounded-2xl font-medium"
        >
          <ShoppingBag className="w-4 h-4" /> Explore Products
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitError(null);
    try {
      // Create Order Snapshot
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      }));

      const orderPayload = {
        customer: {
          name: data.name,
          phone: data.phone,
          address: data.address,
          notes: data.notes || '',
        },
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
      };

      const result = await createOrderMutation.mutateAsync(orderPayload);

      if (result.success) {
        setConfirmedOrder(result.order);
        clearCart();
        setIsSuccessModalOpen(true);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setSubmitError(err?.message || 'Unable to submit your order. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        order={confirmedOrder}
      />

      {/* Top Header */}
      <div>
        <button
          onClick={() => navigate('/cart')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-warmbrown-600 dark:text-darkbg-muted hover:text-sage-600 dark:hover:text-sage-300 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Cart
        </button>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
          Guest Checkout
        </h1>
        <p className="text-xs sm:text-sm text-warmbrown-600 dark:text-darkbg-muted mt-1">
          No account needed. Fill in your delivery details and we will confirm your order.
        </p>
      </div>

      {submitError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs sm:text-sm text-rose-600 dark:text-rose-300">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Customer Delivery Details Form */}
        <div className="lg:col-span-7 bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-6 sm:p-8 shadow-cozy space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-cream-100 dark:border-darkbg-border">
            <User className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <h2 className="text-xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
              Delivery Information
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Mariam El-Sayed"
                  {...register('name')}
                  className={`w-full pl-10 pr-4 py-3 bg-cream-50 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border ${
                    errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-cream-300 dark:border-darkbg-border focus:ring-sage-400'
                  } outline-none focus:ring-2 transition-all`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="e.g. +20 100 123 4567"
                  {...register('phone')}
                  className={`w-full pl-10 pr-4 py-3 bg-cream-50 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border ${
                    errors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-cream-300 dark:border-darkbg-border focus:ring-sage-400'
                  } outline-none focus:ring-2 transition-all`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Delivery Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
                Delivery Address *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <textarea
                  rows={3}
                  placeholder="Building / Villa #, Street, District, City"
                  {...register('address')}
                  className={`w-full pl-10 pr-4 py-3 bg-cream-50 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border ${
                    errors.address ? 'border-rose-400 focus:ring-rose-400' : 'border-cream-300 dark:border-darkbg-border focus:ring-sage-400'
                  } outline-none focus:ring-2 transition-all`}
                />
              </div>
              {errors.address && (
                <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>
              )}
            </div>

            {/* Additional Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream">
                Additional Notes / Gift Preferences (Optional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <textarea
                  rows={2}
                  placeholder="Preferred delivery time, gift ribbon message..."
                  {...register('notes')}
                  className="w-full pl-10 pr-4 py-3 bg-cream-50 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-sm border border-cream-300 dark:border-darkbg-border focus:ring-2 focus:ring-sage-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || createOrderMutation.isPending}
              className="w-full py-4 px-6 bg-sage-400 hover:bg-sage-500 text-white font-bold rounded-2xl shadow-cozy hover:shadow-cozy-lg transition-all duration-300 flex items-center justify-center gap-2 text-base disabled:opacity-50 mt-6"
            >
              {isSubmitting || createOrderMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirm Order</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Preview */}
        <div className="lg:col-span-5 bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-6 shadow-cozy space-y-6 sticky top-28">
          <h2 className="text-xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream pb-3 border-b border-cream-100 dark:border-darkbg-border">
            Order Items ({items.length})
          </h2>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded-xl object-cover bg-cream-100 dark:bg-darkbg-surface flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-warmbrown-800 dark:text-darkbg-cream truncate">
                    {product.name}
                  </h4>
                  <p className="text-[11px] text-warmbrown-600 dark:text-darkbg-muted">
                    Qty: {quantity} × {formatCurrency(product.price)}
                  </p>
                </div>
                <span className="text-xs font-bold text-warmbrown-800 dark:text-darkbg-cream">
                  {formatCurrency(product.price * quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-cream-100 dark:border-darkbg-border space-y-2 text-xs">
            <div className="flex justify-between text-warmbrown-600 dark:text-darkbg-muted">
              <span>Subtotal</span>
              <span className="font-semibold text-warmbrown-800 dark:text-darkbg-cream">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-warmbrown-600 dark:text-darkbg-muted">
              <span>Delivery Fee</span>
              <span className="font-semibold text-warmbrown-800 dark:text-darkbg-cream">{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="pt-2 flex justify-between items-center text-sm font-bold border-t border-cream-100 dark:border-darkbg-border">
              <span className="text-warmbrown-800 dark:text-darkbg-cream">Total Amount</span>
              <span className="text-lg text-rose-500 dark:text-rose-300 font-sans">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
