import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, AlertCircle } from 'lucide-react';
import { CartItem, AppSettings, OrderPayload } from '../types';
import { generateOrderId, submitOrderToScript, saveCustomerInfo, validateIndianMobile, cleanMobileNumber } from '../services/api';
import { formatWhatsAppMessage, getWhatsAppUrl, openWhatsAppDirectly, OWNER_WHATSAPP_TARGET } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  settings: AppSettings;
  onOrderSuccess: (order: OrderPayload) => void;
  onOpenJustOrder: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  settings,
  onOrderSuccess,
  onOpenJustOrder
}) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [locationText, setLocationText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Always start with completely blank fields
  useEffect(() => {
    if (!isOpen) return;
    try {
      localStorage.removeItem('banhatti_cart_customer');
    } catch (e) {
      // Ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product.offerPrice && item.product.offerPrice < item.product.price
      ? item.product.offerPrice
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (cartItems.length === 0) {
      setValidationError('Your cart is empty. Please add items to proceed.');
      return;
    }

    if (!customerName.trim()) {
      setValidationError('Please enter your Name.');
      return;
    }

    const cleanPhone = cleanMobileNumber(phone);
    if (!validateIndianMobile(cleanPhone)) {
      setValidationError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setIsSubmitting(true);

    try {
      saveCustomerInfo({ name: customerName.trim(), phone: cleanPhone, address: locationText });

      const productsSummary = cartItems
        .map((item) => {
          const price = item.product.offerPrice && item.product.offerPrice < item.product.price
            ? item.product.offerPrice
            : item.product.price;
          const unit = item.product.unit ? ` (${item.product.unit})` : '';
          return `• ${item.product.name}${unit} × ${item.quantity} — ${settings.currencySymbol}${price * item.quantity}`;
        })
        .join('\n');

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      const orderItems = cartItems.map((item) => {
        const price = item.product.offerPrice && item.product.offerPrice < item.product.price
          ? item.product.offerPrice
          : item.product.price;
        return {
          id: item.product.id,
          name: item.product.name,
          price,
          quantity: item.quantity,
          image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : '',
          unit: item.product.unit || ''
        };
      });

      const orderPayload: OrderPayload = {
        orderId: generateOrderId(),
        orderType: 'PRODUCT_ORDER',
        customerName: customerName.trim(),
        phone: cleanPhone,
        request: '',
        productsSummary,
        subtotal,
        totalAmount: subtotal,
        items: orderItems,
        customerLocation: locationText.trim() || 'Shared during phone call',
        googleMapsLink: '',
        date: dateStr,
        time: timeStr,
        createdAt: now.toISOString(),
        status: 'NEW_ORDER'
      };

      // 1. Prepare WhatsApp message and URL
      const waMsg = formatWhatsAppMessage(orderPayload, settings);
      const waUrl = getWhatsAppUrl(OWNER_WHATSAPP_TARGET, waMsg);

      // 2. Open WhatsApp immediately
      openWhatsAppDirectly(waUrl);

      // 3. Clear Cart
      onClearCart();

      // 4. Submit to Google Sheets in background
      submitOrderToScript(orderPayload, settings.googleScriptUrl).catch((err) => {
        console.warn('Google Sheet background logging notice:', err);
      });

      // 5. Show success screen
      onOrderSuccess(orderPayload);
      
      // Reset customer input fields
      setCustomerName('');
      setPhone('');
      setLocationText('');
      onClose();
    } catch (err: any) {
      console.error('Order submission error:', err);
      setValidationError('Failed to place order. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        id="cart-drawer-panel"
        className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header */}
        <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-gray-900 leading-tight">Shopping Cart</h3>
                {totalItemCount > 0 && (
                  <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 font-normal">
                Banhatti Local Store Order
              </p>
            </div>
          </div>

          <button
            id="close-cart-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-3 border border-gray-100">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-gray-900 text-base">Your cart is empty</h4>
            <p className="text-xs text-gray-500 max-w-xs mt-1 leading-relaxed">
              Add items from the menu or use Just Order to request items from any local shop.
            </p>
            <div className="mt-5 flex flex-col gap-2 w-full max-w-xs">
              <button
                onClick={onClose}
                className="py-2.5 px-4 bg-gray-900 hover:bg-black text-white font-medium text-xs rounded-xl shadow-2xs transition-colors"
              >
                Browse Items
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenJustOrder();
                }}
                className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs rounded-xl shadow-2xs transition-colors"
              >
                🛵 Just Order
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gray-50/50">
            {/* Items List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">Order Items</span>
                <button 
                  onClick={onClearCart}
                  className="text-[11px] text-gray-400 hover:text-rose-500 font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>

              {cartItems.map((item) => {
                const hasOffer = item.product.offerPrice && item.product.offerPrice < item.product.price;
                const unitPrice = hasOffer ? item.product.offerPrice! : item.product.price;
                const itemTotal = unitPrice * item.quantity;
                const img = item.product.images && item.product.images.length > 0
                  ? item.product.images[0]
                  : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';

                return (
                  <div
                    key={item.product.id}
                    id={`cart-item-${item.product.id}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs"
                  >
                    <img
                      src={img}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-100 border border-gray-100"
                    />

                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                        {item.product.name}
                      </h5>
                      <span className="text-[11px] text-gray-400 block font-normal">
                        {settings.currencySymbol}{unitPrice} each
                      </span>
                    </div>

                    {/* Quantity controls & total */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="font-bold text-xs sm:text-sm text-gray-900">
                        {settings.currencySymbol}{itemTotal}
                      </span>
                      
                      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded transition-colors"
                          aria-label="Reduce"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-500" /> : <Minus className="w-2.5 h-2.5" />}
                        </button>
                        <span className="px-1.5 text-xs font-bold text-gray-900 min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bill Summary Box */}
            <div className="p-4 bg-white rounded-xl border border-gray-200/80 shadow-2xs space-y-2.5">
              <h4 className="text-xs font-bold text-gray-900">Bill Summary</h4>
              
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Items Total</span>
                  <span className="font-semibold text-gray-900">{settings.currencySymbol}{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-gray-500 font-medium">Decided on call</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between items-baseline font-bold">
                  <span className="text-gray-900">Estimated Total</span>
                  <span className="text-base text-orange-600">{settings.currencySymbol}{subtotal}</span>
                </div>
              </div>

              <div className="bg-orange-50/70 rounded-lg p-2.5 text-[11px] text-orange-800 flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                <span>Pay via Cash or UPI upon delivery.</span>
              </div>
            </div>

            {/* Delivery Details Form */}
            <form onSubmit={handleSubmitOrder} className="bg-white rounded-xl border border-gray-200/80 shadow-2xs p-4 space-y-3">
              <h4 className="text-xs font-bold text-gray-900">
                Delivery Details
              </h4>

              {validationError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="cart-name" className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Name <span className="text-orange-500">*</span>
                </label>
                <input
                  id="cart-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="cart-phone" className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number <span className="text-orange-500">*</span> <span className="text-gray-400 font-normal">(10 digits)</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-semibold text-gray-500 pointer-events-none select-none">
                    +91
                  </span>
                  <input
                    id="cart-phone"
                    type="tel"
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    required
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setPhone(val.slice(0, 10));
                    }}
                    placeholder="9876543210"
                    className="w-full text-xs sm:text-sm pl-12 pr-3 py-2 rounded-lg border border-gray-200 bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none text-gray-900 placeholder:text-gray-400 font-medium tracking-wide"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="cart-address" className="block text-xs font-semibold text-gray-700 mb-1">
                  Address / Landmark <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="cart-address"
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="e.g. Near Kalmeshwar Temple, Somwar Peth, Banhatti"
                  className="w-full text-xs sm:text-sm px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none bg-white text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Submit CTA */}
              <button
                id="submit-cart-order-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
