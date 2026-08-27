import React from 'react';
import { ShoppingBag, X } from 'lucide-react';

export type ToastMessage = {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info';
};

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between p-4 bg-white dark:bg-darkbg-card border border-sage-300 dark:border-darkbg-border shadow-cozy-lg rounded-2xl animate-fade-in text-warmbrown-800 dark:text-darkbg-cream"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sage-100 dark:bg-sage-900/60 text-sage-600 dark:text-sage-300 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-warmbrown-600 dark:text-darkbg-muted mt-0.5">
                  {toast.message}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
