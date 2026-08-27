import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useProducts, useDeleteProduct } from '../../hooks/useProducts';
import { formatCurrency, getAvailabilityBadgeStyle, getAvailabilityLabel } from '../../utils/formatters';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { TableRowSkeleton } from '../../components/ui/SkeletonLoader';
import { EmptyState } from '../../components/ui/EmptyState';

export const AdminProducts: React.FC = () => {
  const { data: products, isLoading, isError } = useProducts();
  const deleteProductMutation = useDeleteProduct();

  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductMutation.mutateAsync(productToDelete.id);
      setProductToDelete(null);
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <ConfirmModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product?"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        isLoading={deleteProductMutation.isPending}
      />

      {/* Header & Add Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
            Products Catalog Management
          </h1>
          <p className="text-xs sm:text-sm text-warmbrown-600 dark:text-darkbg-muted mt-1">
            Add new handmade creations, edit inventory details, and manage availability.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 py-3 px-5 bg-sage-400 hover:bg-sage-500 text-white font-bold rounded-2xl shadow-cozy hover:shadow-cozy-lg transition-all text-xs sm:text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by title or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-cream-100 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-xs sm:text-sm border-none focus:ring-2 focus:ring-sage-400 outline-none"
          />
        </div>
      </div>

      {/* Main Table / Grid */}
      {isLoading ? (
        <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-6 shadow-sm">
          <table className="w-full">
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-xs text-rose-600 bg-rose-50 rounded-3xl">
          Error loading products.
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState type="products" title="No products found" />
      ) : (
        <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-cream-50 dark:bg-darkbg-surface border-b border-cream-200 dark:border-darkbg-border text-warmbrown-600 dark:text-darkbg-muted font-semibold">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 dark:divide-darkbg-border/60">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-cream-50/60 dark:hover:bg-darkbg-surface/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-cream-100 dark:bg-darkbg-surface flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-warmbrown-800 dark:text-darkbg-cream block truncate max-w-[200px] sm:max-w-xs">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-warmbrown-500 dark:text-darkbg-muted block">ID: {product.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-warmbrown-700 dark:text-darkbg-cream font-medium">{product.category}</td>
                    <td className="p-4 font-bold text-rose-500 dark:text-rose-300">{formatCurrency(product.price)}</td>
                    <td className="p-4 font-semibold">{product.stock} units</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border ${getAvailabilityBadgeStyle(product.availability)}`}>
                        {getAvailabilityLabel(product.availability)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-2 text-warmbrown-600 dark:text-darkbg-muted hover:text-sage-600 dark:hover:text-sage-300 bg-cream-100 dark:bg-darkbg-surface rounded-xl transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setProductToDelete({ id: product.id, name: product.name })}
                          className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 dark:bg-rose-950/40 rounded-xl transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
