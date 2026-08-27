import type { OrderStatus } from '../types/order';
import type { ProductAvailability } from '../types/product';

export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('en-US')} EGP`;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Validates Egyptian mobile phone numbers.
 * Valid formats:
 * - 01012345678 (11 digits starting with 010, 011, 012, 015)
 * - +201012345678 or 00201012345678
 */
export const isValidEgyptianPhone = (phone: string): boolean => {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const egPhoneRegex = /^(?:\+20|0020|0)?1[0125]\d{8}$/;
  return egPhoneRegex.test(cleaned);
};

export const getAvailabilityLabel = (availability: ProductAvailability): string => {
  switch (availability) {
    case 'in-stock':
      return 'In Stock';
    case 'low-stock':
      return 'Low Stock';
    case 'out-of-stock':
      return 'Out of Stock';
    case 'made-to-order':
      return 'Made to Order';
    default:
      return availability;
  }
};

export const getAvailabilityBadgeStyle = (availability: ProductAvailability): string => {
  switch (availability) {
    case 'in-stock':
      return 'bg-sage-100 text-sage-800 dark:bg-sage-900/50 dark:text-sage-300 border-sage-300 dark:border-sage-700';
    case 'low-stock':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700';
    case 'out-of-stock':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-700';
    case 'made-to-order':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300 dark:border-rose-700';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getOrderStatusBadgeStyle = (status: OrderStatus): string => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
    case 'cancelled':
      return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
