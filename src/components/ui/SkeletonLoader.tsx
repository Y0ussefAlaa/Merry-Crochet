import React from 'react';

export const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-4 shadow-sm animate-pulse flex flex-col h-full">
    <div className="w-full h-56 bg-cream-200 dark:bg-darkbg-surface rounded-2xl mb-4" />
    <div className="h-4 bg-cream-200 dark:bg-darkbg-surface rounded-md w-3/4 mb-2" />
    <div className="h-3 bg-cream-200 dark:bg-darkbg-surface rounded-md w-1/2 mb-4" />
    <div className="mt-auto flex items-center justify-between pt-2">
      <div className="h-6 bg-cream-200 dark:bg-darkbg-surface rounded-md w-20" />
      <div className="h-10 w-28 bg-cream-200 dark:bg-darkbg-surface rounded-xl" />
    </div>
  </div>
);

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
    <div className="w-full h-96 sm:h-[450px] bg-cream-200 dark:bg-darkbg-surface rounded-3xl" />
    <div className="flex flex-col gap-4">
      <div className="h-8 bg-cream-200 dark:bg-darkbg-surface rounded-lg w-3/4" />
      <div className="h-6 bg-cream-200 dark:bg-darkbg-surface rounded-lg w-1/4" />
      <div className="h-24 bg-cream-200 dark:bg-darkbg-surface rounded-xl w-full" />
      <div className="h-12 bg-cream-200 dark:bg-darkbg-surface rounded-xl w-full mt-6" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <tr className="animate-pulse border-b border-cream-200 dark:border-darkbg-border">
    <td className="p-4"><div className="h-4 bg-cream-200 dark:bg-darkbg-surface rounded w-20" /></td>
    <td className="p-4"><div className="h-4 bg-cream-200 dark:bg-darkbg-surface rounded w-32" /></td>
    <td className="p-4"><div className="h-4 bg-cream-200 dark:bg-darkbg-surface rounded w-24" /></td>
    <td className="p-4"><div className="h-4 bg-cream-200 dark:bg-darkbg-surface rounded w-16" /></td>
    <td className="p-4"><div className="h-6 bg-cream-200 dark:bg-darkbg-surface rounded-full w-24" /></td>
    <td className="p-4"><div className="h-8 bg-cream-200 dark:bg-darkbg-surface rounded-lg w-16" /></td>
  </tr>
);
