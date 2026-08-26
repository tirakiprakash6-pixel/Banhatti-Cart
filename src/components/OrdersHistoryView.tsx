import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Search, 
  Store, 
  Check, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import { OrderPayload } from '../types';

interface OrdersHistoryViewProps {
  orders: OrderPayload[];
  onStartShopping: () => void;
  onUpdateOrderStatus?: (orderId: string, status: 'NEW_ORDER' | 'CONFIRMED' | 'PURCHASING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED') => void;
}

export const OrdersHistoryView: React.FC<OrdersHistoryViewProps> = ({ 
  orders, 
  onStartShopping,
  onUpdateOrderStatus 
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleMarkDone = (orderId: string) => {
    setUpdatingOrderId(orderId);
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, 'DELIVERED');
    }
    setTimeout(() => {
      setUpdatingOrderId(null);
    }, 800);
  };

  const filteredOrders = orders.filter(order => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesId = order.orderId?.toLowerCase().includes(q);
    const matchesCustomer = order.customerName?.toLowerCase().includes(q);
    const matchesSummary = order.productsSummary?.toLowerCase().includes(q);
    const matchesItem = order.items?.some(i => i.name.toLowerCase().includes(q));
    return matchesId || matchesCustomer || matchesSummary || matchesItem;
  });

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        {/* Clean Empty State Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-8 sm:p-10 shadow-2xs max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto bg-orange-50 border border-orange-100/80 rounded-2xl flex items-center justify-center text-orange-500 mb-4 shadow-2xs">
            <ShoppingBag className="w-8 h-8 stroke-[1.75]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1.5 tracking-tight">No orders placed yet</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            When you order local dishes, fresh groceries, or bakery items, they will appear here with live tracking.
          </p>
          <button
            id="orders-start-shopping-btn"
            onClick={onStartShopping}
            className="w-full py-3 px-5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>Explore Menu & Order</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-2 sm:px-4 py-2 space-y-4">
      {/* Header bar without numbers and quick shopping button */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-900">Your Orders</h2>
          <p className="text-xs text-gray-500 mt-0.5">click done after delivery</p>
        </div>

        <button
          onClick={onStartShopping}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Order More</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter / Search Bar if multiple orders */}
      {orders.length > 2 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by item name..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      )}

      {/* Order Cards */}
      <div className="space-y-4">
        {filteredOrders.map((order, idx) => {
          const isCompleted = order.status === 'DELIVERED';
          const isJustOrder = order.orderType === 'JUST_ORDER';
          const itemsCount = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 1;
          const displayTotal = order.totalAmount !== undefined ? order.totalAmount : order.subtotal;

          // Parse items from either items array or summary string
          let parsedItems = order.items && order.items.length > 0 ? order.items : [];
          if (parsedItems.length === 0 && order.productsSummary) {
            const lines = order.productsSummary.split('\n').filter(l => l.trim().length > 0);
            parsedItems = lines.map(line => ({
              name: line.replace(/^[•\-\*]\s*/, ''),
              quantity: 1,
              price: 0
            }));
          }

          return (
            <div
              key={order.orderId || `order-${idx}`}
              className="bg-white rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-xs transition-all overflow-hidden"
            >
              {/* Top Order Card Header */}
              <div className="p-4 sm:p-5 pb-3.5 border-b border-gray-100">
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="space-y-1">
                    {isJustOrder && (
                      <div>
                        <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200/50 inline-flex items-center gap-1">
                          <span>🛵</span> Custom Order
                        </span>
                      </div>
                    )}
                    <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{order.date || 'Today'} • {order.time || 'Recent'}</span>
                    </p>
                  </div>

                  {/* Total Price pill */}
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-medium block uppercase tracking-wider">Total</span>
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      {displayTotal > 0 ? `₹${displayTotal}` : 'Custom bill'}
                    </span>
                  </div>
                </div>

                {/* Progress / Status Bar */}
                <div className="mt-3 bg-gray-50/90 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-600 mb-1.5">
                    {isCompleted ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Order Completed
                      </span>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Order Confirmed
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-xs text-gray-500 font-medium">
                        <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          Completed
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Progress Bar: Loading / animated pulse in progress, 100% full when Done */}
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    {isCompleted ? (
                      <div className="bg-emerald-500 h-full rounded-full w-full transition-all duration-500 ease-out shadow-xs" />
                    ) : (
                      <div className="bg-emerald-500 h-full rounded-full w-3/5 animate-pulse transition-all duration-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Product Line Items */}
              <div className="p-4 sm:p-5 py-3.5 divide-y divide-gray-100">
                {parsedItems.map((item, itemIdx) => {
                  const defaultImg = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';
                  const itemImg = item.image || defaultImg;

                  return (
                    <div key={itemIdx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Thumbnail Image / Icon with Qty badge */}
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200/80 overflow-hidden shrink-0 relative flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={itemImg}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = defaultImg;
                              }}
                            />
                          ) : (
                            <span className="text-xl">
                              {isJustOrder ? '🛵' : '🥘'}
                            </span>
                          )}
                          <span className="absolute bottom-0 right-0 bg-gray-900/90 text-white text-[9px] font-bold px-1 rounded-tl">
                            {item.quantity}×
                          </span>
                        </div>

                        {/* Product Title and Unit */}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate leading-snug">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            {item.unit && (
                              <span className="text-[11px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {item.unit}
                              </span>
                            )}
                            <span className="text-[11px] text-gray-500 font-medium">
                              Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right shrink-0">
                        {item.price > 0 ? (
                          <div>
                            <span className="text-xs sm:text-sm font-bold text-gray-900">
                              ₹{item.price * item.quantity}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-gray-400 block">
                                (₹{item.price} each)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-500 italic">
                            As per bill
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar with DONE button */}
              <div className="px-4 sm:px-5 py-3 bg-gray-50/90 border-t border-gray-100 flex items-center justify-between">
                <div>
                  {isCompleted ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Order Completed (End: Yes)</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={updatingOrderId === order.orderId}
                      onClick={() => handleMarkDone(order.orderId)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-80 text-white text-xs font-bold rounded-lg shadow-xs shadow-emerald-600/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      title="Click to complete delivery and update Google Sheet End column"
                    >
                      {updatingOrderId === order.orderId ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>DONE</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-500">
                    {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
