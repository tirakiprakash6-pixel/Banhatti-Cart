import React from 'react';
import { CheckCircle2, ShoppingBag, MapPin } from 'lucide-react';
import { OrderPayload, AppSettings } from '../types';

interface OrderSuccessModalProps {
  order: OrderPayload | null;
  settings: AppSettings;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  settings,
  onClose
}) => {
  if (!order) return null;

  return (
    <div
      id="order-success-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="order-success-modal-content"
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 relative my-auto p-6 sm:p-7 text-center animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100 shadow-sm">
          <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 tracking-tight">
          Order Placed Successfully!
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Thank you, <span className="font-semibold text-gray-800">{order.customerName}</span>. Your order is logged with Banhatti Cart.
        </p>

        {/* Clean Order Card */}
        <div className="my-4 p-4 bg-gray-50/90 rounded-2xl border border-gray-200/70 text-left text-xs space-y-2.5">
          <div className="flex items-center justify-between text-gray-500">
            <span>Order Reference</span>
            <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded-md border border-gray-200 text-[11px]">
              {order.orderId}
            </span>
          </div>

          <div className="flex items-center justify-between text-gray-500">
            <span>Customer Phone</span>
            <span className="font-semibold text-gray-900">+91 {order.phone}</span>
          </div>

          {order.customerLocation && (
            <div className="flex items-start justify-between gap-3 text-gray-500 pt-1 border-t border-gray-200/60">
              <span className="shrink-0 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>Delivery:</span>
              </span>
              <span className="font-medium text-gray-800 text-right truncate">
                {order.customerLocation}
              </span>
            </div>
          )}

          {order.subtotal > 0 && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200/80 font-medium">
              <span className="text-gray-700">Total Amount</span>
              <span className="font-bold text-base text-gray-900">
                {settings.currencySymbol || '₹'}{order.subtotal}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            id="success-back-home-btn"
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
