import React from 'react';
import { ShoppingBag, PackageOpen, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  type: 'cart' | 'orders' | 'products';
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  actionLink,
  onActionClick,
}) => {
  const getDefaults = () => {
    switch (type) {
      case 'cart':
        return {
          icon: ShoppingBag,
          title: title || 'Your cart is waiting for something handmade.',
          description: description || 'Explore our cozy crochet collections and add warm handmade pieces to your cart.',
          actionText: actionText || 'Explore Products',
          actionLink: actionLink || '/products',
        };
      case 'orders':
        return {
          icon: PackageOpen,
          title: title || 'No orders yet.',
          description: description || 'When customer orders are placed, they will appear here.',
          actionText: actionText,
          actionLink: actionLink,
        };
      case 'products':
        return {
          icon: Inbox,
          title: title || 'No products available.',
          description: description || 'Try adjusting your search filters or check back soon for new handmade creations.',
          actionText: actionText,
          actionLink: actionLink,
        };
    }
  };

  const defaults = getDefaults();
  const Icon = defaults.icon;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white/60 dark:bg-darkbg-card/60 backdrop-blur-sm border border-cream-200 dark:border-darkbg-border rounded-3xl my-6 animate-fade-in">
      <div className="p-4 bg-sage-100 dark:bg-sage-950/60 text-sage-600 dark:text-sage-300 rounded-full mb-4 shadow-sm">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl sm:text-2xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream mb-2">
        {defaults.title}
      </h3>
      <p className="text-warmbrown-600 dark:text-darkbg-muted max-w-md mb-6 text-sm sm:text-base leading-relaxed">
        {defaults.description}
      </p>

      {defaults.actionText && defaults.actionLink && (
        <Link
          to={defaults.actionLink}
          className="inline-flex items-center gap-2 py-3 px-6 bg-sage-400 hover:bg-sage-500 text-white font-medium rounded-2xl shadow-cozy hover:shadow-cozy-lg transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
        >
          {defaults.actionText}
        </Link>
      )}

      {defaults.actionText && !defaults.actionLink && onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 py-3 px-6 bg-sage-400 hover:bg-sage-500 text-white font-medium rounded-2xl shadow-cozy hover:shadow-cozy-lg transition-all duration-300 text-sm sm:text-base"
        >
          {defaults.actionText}
        </button>
      )}
    </div>
  );
};
