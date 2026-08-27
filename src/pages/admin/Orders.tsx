import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency, formatDate, getOrderStatusBadgeStyle } from '../../utils/formatters';
import { EmptyState } from '../../components/ui/EmptyState';
import { TableRowSkeleton } from '../../components/ui/SkeletonLoader';

export const Orders: React.FC = () => {
  const { data: orders, isLoading, isError } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders?.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  }) || [];

  const statuses: { label: string; value: string }[] = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Title */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
          Orders Management
        </h1>
        <p className="text-xs sm:text-sm text-warmbrown-600 dark:text-darkbg-muted mt-1">
          View customer orders, call customers directly, and manage order statuses.
        </p>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, name, or phone..."
            className="w-full pl-10 pr-4 py-2.5 bg-cream-100 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream rounded-2xl text-xs sm:text-sm border-none focus:ring-2 focus:ring-sage-400 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {statuses.map((st) => (
            <button
              key={st.value}
              onClick={() => setStatusFilter(st.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st.value
                  ? 'bg-sage-400 text-white shadow-sm'
                  : 'bg-cream-100 dark:bg-darkbg-surface text-warmbrown-700 dark:text-darkbg-muted hover:bg-cream-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table (Desktop) / Cards Grid (Mobile) */}
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
        <div className="p-8 text-center text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-3xl">
          Error loading orders. Please try again.
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState type="orders" title="No orders match your filter" />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-50 dark:bg-darkbg-surface border-b border-cream-200 dark:border-darkbg-border text-warmbrown-600 dark:text-darkbg-muted font-semibold">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 dark:divide-darkbg-border/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50/60 dark:hover:bg-darkbg-surface/50 transition-colors">
                    <td className="p-4 font-bold text-warmbrown-800 dark:text-darkbg-cream">{order.id}</td>
                    <td className="p-4 font-medium">{order.customer.name}</td>
                    <td className="p-4 font-mono text-xs text-warmbrown-600 dark:text-darkbg-muted">{order.customer.phone}</td>
                    <td className="p-4 font-bold text-rose-500 dark:text-rose-300">{formatCurrency(order.total)}</td>
                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border capitalize ${getOrderStatusBadgeStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-warmbrown-600 dark:text-darkbg-muted">{formatDate(order.createdAt)}</td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-sage-100 hover:bg-sage-200 dark:bg-sage-950/60 dark:hover:bg-sage-900 text-sage-800 dark:text-sage-300 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-warmbrown-800 dark:text-darkbg-cream">{order.id}</span>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border capitalize ${getOrderStatusBadgeStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-warmbrown-600 dark:text-darkbg-muted">
                  <p><strong className="text-warmbrown-800 dark:text-darkbg-cream">Customer:</strong> {order.customer.name}</p>
                  <p><strong className="text-warmbrown-800 dark:text-darkbg-cream">Phone:</strong> {order.customer.phone}</p>
                  <p><strong className="text-warmbrown-800 dark:text-darkbg-cream">Total:</strong> <span className="font-bold text-rose-500">{formatCurrency(order.total)}</span></p>
                  <p><strong className="text-warmbrown-800 dark:text-darkbg-cream">Date:</strong> {formatDate(order.createdAt)}</p>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="w-full py-2.5 bg-sage-400 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> View Details & Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
