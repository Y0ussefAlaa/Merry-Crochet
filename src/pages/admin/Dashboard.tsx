import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Clock, PackageCheck, DollarSign, ArrowUpRight, CheckCircle2, Mail } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import { useMessages } from '../../hooks/useMessages';
import { formatCurrency, getOrderStatusBadgeStyle } from '../../utils/formatters';

export const Dashboard: React.FC = () => {
  const { data: orders, isLoading: isOrdersLoading } = useOrders();
  const { data: products } = useProducts();
  const { data: messages } = useMessages();

  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((o) => o.status === 'pending').length || 0;
  const confirmedOrders = orders?.filter((o) => o.status === 'confirmed').length || 0;
  const totalProducts = products?.length || 0;
  const totalMessages = messages?.length || 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0) || 0;

  const recentOrders = orders?.slice(0, 5) || [];

  const statCards = [
    { title: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'bg-blue-500', link: '/admin/orders' },
    { title: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'bg-amber-500', link: '/admin/orders' },
    { title: 'Confirmed Orders', value: confirmedOrders, icon: CheckCircle2, color: 'bg-emerald-500', link: '/admin/orders' },
    { title: 'Total Products', value: totalProducts, icon: PackageCheck, color: 'bg-sage-500', link: '/admin/products' },
    { title: 'Inquiries Messages', value: totalMessages, icon: Mail, color: 'bg-purple-500', link: '/admin/messages' },
    { title: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'bg-rose-500', link: '/admin/orders' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Title */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
          Dashboard Overview
        </h1>
        <p className="text-xs sm:text-sm text-warmbrown-600 dark:text-darkbg-muted mt-1">
          Monitor your store metrics, recent orders, and inventory activity.
        </p>
      </div>

      {/* Metric Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-5 shadow-sm hover:shadow-cozy transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-warmbrown-600 dark:text-darkbg-muted font-semibold">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-2xl text-white ${card.color} shadow-sm group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-bold font-sans text-warmbrown-800 dark:text-darkbg-cream">
                  {card.value}
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-sage-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-sage-600 dark:text-sage-300 hover:underline"
          >
            View All Orders
          </Link>
        </div>

        {isOrdersLoading ? (
          <div className="p-8 text-center text-xs text-gray-400">Loading recent orders...</div>
        ) : recentOrders.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-cream-200 dark:border-darkbg-border text-warmbrown-500 dark:text-darkbg-muted font-semibold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 dark:divide-darkbg-border/60">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-50 dark:hover:bg-darkbg-surface/50 transition-colors">
                    <td className="py-3 font-semibold text-warmbrown-800 dark:text-darkbg-cream">{order.id}</td>
                    <td className="py-3">{order.customer.name}</td>
                    <td className="py-3 font-mono text-xs">{order.customer.phone}</td>
                    <td className="py-3 font-bold text-rose-500 dark:text-rose-300">{formatCurrency(order.total)}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full capitalize border ${getOrderStatusBadgeStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-sage-600 dark:text-sage-400 font-semibold hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
