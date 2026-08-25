import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, AlertCircle, Plus, Minus } from 'lucide-react';
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

      // 2. Open WhatsApp immediately to avoid browser popup blockers
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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="direct-order-modal"
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
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
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Selected Product Card */}
          <div className="p-3.5 bg-orange-50/50 rounded-xl border border-orange-100 flex items-center gap-3">
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

          {/* Customer Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="direct-order-name-input"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Anand Pattar"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                  +91
                </span>
                <input
                  id="direct-order-phone-input"
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono"
                />
              </div>
            </div>            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Delivery Address / Landmark <span className="text-gray-400 font-normal lowercase">(optional)</span>
              </label>
              <textarea
                id="direct-order-location-input"
                rows={2}
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="e.g. Near Kalmeshwar Temple, Main Road, Banhatti"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-600 font-medium">Total Payable ({quantity} item{quantity > 1 ? 's' : ''})</span>
            <span className="text-lg font-bold text-gray-900">
              {settings.currencySymbol}{totalPrice}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              id="cancel-direct-order-btn"
              onClick={onClose}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-direct-order-btn"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Confirm & Place Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
