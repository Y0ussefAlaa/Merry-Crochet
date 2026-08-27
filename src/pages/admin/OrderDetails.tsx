import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageSquare, MapPin, User, FileText, Calendar, ShoppingBag, Loader2 } from 'lucide-react';
import { useOrder, useUpdateOrderStatus } from '../../hooks/useOrders';
import { formatCurrency, formatDate, getOrderStatusBadgeStyle } from '../../utils/formatters';
import type { OrderStatus } from '../../types/order';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: order, isLoading, isError } = useOrder(id);
  const updateStatusMutation = useUpdateOrderStatus();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-warmbrown-600 dark:text-darkbg-muted">
        Loading order details...
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-md mx-auto p-8 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif">Order Not Found</h2>
        <p className="text-xs text-warmbrown-600 dark:text-darkbg-muted">The requested order does not exist.</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="py-2 px-4 bg-sage-400 text-white rounded-xl text-xs font-semibold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  // Clean phone string for WhatsApp link
  const cleanPhone = order.customer.phone.replace(/[^\d+]/g, '').replace('+', '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello ${order.customer.name}, this is Merry Crochet regarding your order ${order.id}.`
  )}`;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    /**
     * TODO: FIRESTORE INTEGRATION
     * Replace mock state update with updateDoc(doc(db, "orders", order.id), { status: newStatus })
     */
    await updateStatusMutation.mutateAsync({ id: order.id, status: newStatus });
  };

  const statuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'cancelled',
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Navigation & Order Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream-200 dark:border-darkbg-border pb-6">
        <div>
          <button
            onClick={() => navigate('/admin/orders')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-warmbrown-600 dark:text-darkbg-muted hover:text-sage-600 dark:hover:text-sage-300 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream">
              Order {order.id}
            </h1>
            <span className={`px-3 py-1 text-xs font-bold rounded-full border capitalize ${getOrderStatusBadgeStyle(order.status)}`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-warmbrown-600 dark:text-darkbg-muted mt-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Status Dropdown Selector */}
        <div className="flex items-center gap-2 bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border p-2 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-warmbrown-700 dark:text-darkbg-cream pl-2">Update Status:</span>
          <select
            value={order.status}
            onChange={handleStatusChange}
            disabled={updateStatusMutation.isPending}
            className="py-2 px-3 bg-cream-100 dark:bg-darkbg-surface text-warmbrown-800 dark:text-darkbg-cream text-xs font-bold rounded-xl border-none focus:ring-2 focus:ring-sage-400 outline-none capitalize cursor-pointer"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          {updateStatusMutation.isPending && <Loader2 className="w-4 h-4 animate-spin text-sage-600" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer Info Card with Direct Call & WhatsApp Buttons */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-6 shadow-cozy space-y-5">
            <h2 className="text-lg font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream pb-3 border-b border-cream-100 dark:border-darkbg-border flex items-center gap-2">
              <User className="w-5 h-5 text-sage-600" /> Customer Contact
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-warmbrown-500 dark:text-darkbg-muted block text-xs">Customer Name</span>
                <span className="font-semibold text-warmbrown-800 dark:text-darkbg-cream text-base">{order.customer.name}</span>
              </div>

              <div>
                <span className="text-warmbrown-500 dark:text-darkbg-muted block text-xs">Phone Number</span>
                <span className="font-mono text-sm font-semibold text-warmbrown-800 dark:text-darkbg-cream">{order.customer.phone}</span>
              </div>

              <div>
                <span className="text-warmbrown-500 dark:text-darkbg-muted block text-xs">Delivery Address</span>
                <p className="font-medium text-warmbrown-800 dark:text-darkbg-cream leading-relaxed mt-0.5 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{order.customer.address}</span>
                </p>
              </div>

              {order.customer.notes && (
                <div className="p-3 bg-cream-50 dark:bg-darkbg-surface rounded-2xl border border-cream-200 dark:border-darkbg-border">
                  <span className="text-warmbrown-500 dark:text-darkbg-muted block text-[11px] font-semibold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-sage-500" /> Customer Notes
                  </span>
                  <p className="text-xs text-warmbrown-800 dark:text-darkbg-cream mt-1 italic">
                    "{order.customer.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Quick Action Contact Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <a
                href={`tel:${order.customer.phone}`}
                className="py-3 px-4 bg-sage-400 hover:bg-sage-500 text-white font-bold rounded-2xl shadow-sm text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Customer</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-sm text-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Ordered Items Breakdown */}
        <div className="lg:col-span-7 bg-white dark:bg-darkbg-card border border-cream-200 dark:border-darkbg-border rounded-3xl p-6 shadow-cozy space-y-6">
          <h2 className="text-lg font-serif font-bold text-warmbrown-800 dark:text-darkbg-cream pb-3 border-b border-cream-100 dark:border-darkbg-border flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sage-600" /> Order Summary & Items
          </h2>

          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-cream-50 dark:bg-darkbg-surface rounded-2xl">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 rounded-xl object-cover bg-white dark:bg-darkbg-card flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm text-warmbrown-800 dark:text-darkbg-cream truncate">
                    {item.productName}
                  </h4>
                  <p className="text-xs text-warmbrown-600 dark:text-darkbg-muted mt-0.5">
                    Price: {formatCurrency(item.price)} × Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-sm text-warmbrown-800 dark:text-darkbg-cream">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-cream-200 dark:border-darkbg-border space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-warmbrown-600 dark:text-darkbg-muted">
              <span>Subtotal</span>
              <span className="font-semibold text-warmbrown-800 dark:text-darkbg-cream">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-warmbrown-600 dark:text-darkbg-muted">
              <span>Delivery Fee</span>
              <span className="font-semibold text-warmbrown-800 dark:text-darkbg-cream">{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="pt-3 border-t border-cream-200 dark:border-darkbg-border flex justify-between items-center text-base font-bold">
              <span className="text-warmbrown-800 dark:text-darkbg-cream">Total Price</span>
              <span className="text-xl text-rose-500 dark:text-rose-300 font-sans">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
