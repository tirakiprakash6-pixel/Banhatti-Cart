import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, AlertCircle, Plus, Minus, ArrowRight } from 'lucide-react';
import { Product, AppSettings, OrderPayload } from '../types';
import { generateOrderId, submitOrderToScript, saveCustomerInfo, loadCustomerInfo, validateIndianMobile, cleanMobileNumber } from '../services/api';
import { formatWhatsAppMessage, getWhatsAppUrl, openWhatsAppDirectly, OWNER_WHATSAPP_TARGET } from '../utils/whatsapp';

interface DirectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  initialQuantity?: number;
  settings: AppSettings;
  onOrderSuccess: (order: OrderPayload) => void;
}

export const DirectOrderModal: React.FC<DirectOrderModalProps> = ({
  isOpen,
  onClose,
  product,
  initialQuantity = 1,
  settings,
  onOrderSuccess
}) => {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [locationText, setLocationText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuantity(initialQuantity > 0 ? initialQuantity : 1);
      setValidationError(null);
      // Try to load saved customer info
      const saved = loadCustomerInfo();
      if (saved) {
        if (saved.name) setCustomerName(saved.name);
        if (saved.phone) setPhone(saved.phone);
        if (saved.address) setLocationText(saved.address);
      }
    }
  }, [isOpen, initialQuantity, product]);

  if (!isOpen || !product) return null;

  const currentPrice = product.offerPrice && product.offerPrice < product.price
    ? product.offerPrice
    : product.price;
  const totalPrice = currentPrice * quantity;

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Automatically smooth scroll focused input into viewport center so mobile keyboard doesn't hide it
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 280);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

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

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      const unit = product.unit ? ` (${product.unit})` : '';
      const productsSummary = `• ${product.name}${unit} × ${quantity} — ${settings.currencySymbol}${totalPrice}`;

      const orderPayload: OrderPayload = {
        orderId: generateOrderId(),
        orderType: 'PRODUCT_ORDER',
        customerName: customerName.trim(),
        phone: cleanPhone,
        request: '',
        productsSummary,
        subtotal: totalPrice,
        totalAmount: totalPrice,
        items: [
          {
            id: product.id,
            name: product.name,
            price: currentPrice,
            quantity: quantity,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            unit: product.unit || ''
          }
        ],
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

      // 2. Open WhatsApp directly in a safe new window/tab
      openWhatsAppDirectly(waUrl);

      // 3. Submit to Google Sheets in background
      submitOrderToScript(orderPayload, settings.googleScriptUrl).catch((err) => {
        console.warn('Google Sheet background logging notice:', err);
      });

      // 4. Trigger success modal
      onOrderSuccess(orderPayload);
      onClose();
    } catch (err: any) {
      console.error('Direct order error:', err);
      setValidationError('Failed to place order. Please try again or call directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="direct-order-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden"
      onClick={onClose}
    >
      <div
        id="direct-order-modal"
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="pt-2 pb-1 flex justify-center sm:hidden bg-white shrink-0">
          <div className="w-12 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 leading-tight">Direct Product Order</h3>
              <p className="text-xs text-gray-400 font-normal">Fast delivery in Banhatti</p>
            </div>
          </div>
          <button
            id="close-direct-order-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form with Scrollable Content Body and Sticky Bottom Actions */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4 touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Selected Product Card */}
            <div className="p-3 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center gap-3">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border border-orange-200/60 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-900 truncate">{product.name}</h4>
                <p className="text-xs text-gray-500">{product.unit || 'Standard portion'}</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-bold text-sm text-orange-600">
                    {settings.currencySymbol}{currentPrice}
                  </span>
                  {product.offerPrice && product.offerPrice < product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      {settings.currencySymbol}{product.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center bg-white border border-orange-200 rounded-xl p-1 shadow-2xs shrink-0">
                <button
                  type="button"
                  id="direct-order-qty-minus"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-sm font-bold text-gray-900 min-w-[24px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  id="direct-order-qty-plus"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Customer Details Inputs */}
            <div className="space-y-3.5">
              <div>
                <label htmlFor="direct-order-name-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="direct-order-name-input"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  onFocus={handleInputFocus}
                  placeholder="e.g. Anand Pattar"
                  className="w-full px-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div>
                <label htmlFor="direct-order-phone-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none select-none">
                    +91
                  </span>
                  <input
                    id="direct-order-phone-input"
                    type="tel"
                    inputMode="numeric"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    onFocus={handleInputFocus}
                    placeholder="8988846666"
                    className="w-full pl-12 pr-3.5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">We will call or WhatsApp you on this number to confirm delivery.</p>
              </div>

              <div>
                <label htmlFor="direct-order-location-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Delivery Address / Landmark <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  id="direct-order-location-input"
                  rows={2}
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  onFocus={handleInputFocus}
                  placeholder="e.g. Near Kalmeshwar Temple, Main Road, Banhatti"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600 font-medium">Payable Amount ({quantity} item{quantity > 1 ? 's' : ''})</span>
              <span className="text-base sm:text-lg font-bold text-gray-900">
                {settings.currencySymbol}{totalPrice}
              </span>
            </div>

            <p className="text-[11px] text-gray-400 text-center pb-2">
              🚚 Pay via Cash or UPI when delivery arrives at your doorstep.
            </p>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-3.5 sm:p-4 bg-white border-t border-gray-100 shrink-0 flex items-center gap-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              id="cancel-direct-order-btn"
              onClick={onClose}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-direct-order-btn"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="truncate">Confirm Order ({settings.currencySymbol}{totalPrice})</span>
                  <ArrowRight className="w-4 h-4 shrink-0 opacity-80" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
