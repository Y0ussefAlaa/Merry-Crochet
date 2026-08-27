import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Heart, Sparkles, CheckCircle, Home, ShoppingBag } from 'lucide-react';
import type { Order } from '../../types/order';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, order }) => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    onClose();
    navigate('/products');
  };

  const handleBackHome = () => {
    onClose();
    navigate('/');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="flex flex-col items-center text-center pt-2 pb-2">
        {/* Animated Celebration Icon */}
        <div className="relative mb-6">
          <div className="p-4 bg-sage-100 dark:bg-sage-900/50 text-sage-600 dark:text-sage-300 rounded-full shadow-inner">
            <CheckCircle className="w-12 h-12 stroke-[2.5]" />
          </div>
          <div className="absolute -top-1 -right-1 text-rose-400 animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-1 -left-1 text-rose-400">
            <Heart className="w-5 h-5 fill-rose-400" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream mb-2">
          Order Confirmed!
        </h2>

        {order && (
          <span className="inline-block px-3 py-1 bg-cream-200 dark:bg-darkbg-surface text-warmbrown-700 dark:text-darkbg-muted rounded-full text-xs font-semibold tracking-wider uppercase mb-4">
            Order Reference: {order.id}
          </span>
        )}

        <p className="text-warmbrown-700 dark:text-darkbg-muted text-sm sm:text-base leading-relaxed mb-6 px-2">
          Thank you for choosing <span className="font-semibold text-sage-600 dark:text-sage-400">Merry Crochet</span>. We will contact you as soon as possible to confirm your order, delivery details, and payment method.
        </p>

        {order && (
          <div className="w-full bg-white dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border rounded-2xl p-4 mb-6 text-left text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-cream-100 dark:border-darkbg-border/60">
              <span className="text-warmbrown-500 dark:text-darkbg-muted">Recipient:</span>
              <span className="font-medium text-warmbrown-800 dark:text-darkbg-cream">{order.customer.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-cream-100 dark:border-darkbg-border/60">
              <span className="text-warmbrown-500 dark:text-darkbg-muted">Phone:</span>
              <span className="font-medium text-warmbrown-800 dark:text-darkbg-cream">{order.customer.phone}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-warmbrown-500 dark:text-darkbg-muted">Estimated Total:</span>
              <span className="font-bold text-rose-500 dark:text-rose-300">{order.total} EGP</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={handleContinueShopping}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 bg-sage-400 hover:bg-sage-500 text-white font-medium rounded-2xl shadow-cozy hover:shadow-cozy-lg transition-all duration-300 text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <button
            onClick={handleBackHome}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 bg-cream-200 hover:bg-cream-300 dark:bg-darkbg-surface dark:hover:bg-darkbg text-warmbrown-800 dark:text-darkbg-cream font-medium rounded-2xl transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
