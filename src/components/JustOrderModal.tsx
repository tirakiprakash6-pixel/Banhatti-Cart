import React, { useState, useEffect, useRef } from 'react';
import { X, AlertCircle, Send, ArrowRight } from 'lucide-react';
import { AppSettings, OrderPayload } from '../types';
import { generateOrderId, submitOrderToScript, saveCustomerInfo, validateIndianMobile, cleanMobileNumber } from '../services/api';
import { formatWhatsAppMessage, getWhatsAppUrl, openWhatsAppDirectly, OWNER_WHATSAPP_TARGET } from '../utils/whatsapp';

interface JustOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onOrderSuccess: (order: OrderPayload) => void;
  initialCategory?: string;
}

export const JustOrderModal: React.FC<JustOrderModalProps> = ({
  isOpen,
  onClose,
  settings,
  onOrderSuccess,
  initialCategory
}) => {
  const [requestText, setRequestText] = useState<string>(() => {
    return initialCategory ? `[Regarding ${initialCategory}]: ` : '';
  });
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [locationText, setLocationText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Always start with completely blank fields
  useEffect(() => {
    if (!isOpen) return;
    try {
      localStorage.removeItem('banhatti_cart_customer');
    } catch (e) {
      // Ignore
    }
    if (initialCategory && !requestText) {
      setRequestText(`[Regarding ${initialCategory}]: `);
    }
  }, [isOpen, initialCategory, requestText]);

  if (!isOpen) return null;

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Automatically smooth scroll focused input into viewport center so mobile keyboard doesn't hide it
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 280);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!requestText.trim()) {
      setValidationError('Please specify what you need (e.g. 2 kg rice, 1 box of sweets, medicine, etc.)');
      return;
    }
    if (!customerName.trim()) {
      setValidationError('Please enter your Name');
      return;
    }
    const cleanPhone = cleanMobileNumber(phone);
    if (!validateIndianMobile(cleanPhone)) {
      setValidationError('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save customer info for next time
      saveCustomerInfo({ name: customerName.trim(), phone: cleanPhone, address: locationText });

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      const orderPayload: OrderPayload = {
        orderId: generateOrderId(),
        orderType: 'JUST_ORDER',
        customerName: customerName.trim(),
        phone: cleanPhone,
        request: requestText.trim(),
        productsSummary: `[CUSTOM REQUEST]: ${requestText.trim()}`,
        subtotal: 0,
        totalAmount: 0,
        items: [
          {
            name: requestText.trim() || 'Custom Order Item',
            price: 0,
            quantity: 1,
            unit: 'Custom Request'
          }
        ],
        customerLocation: locationText.trim() || 'Shared during phone call',
        googleMapsLink: '',
        date: dateStr,
        time: timeStr,
        createdAt: now.toISOString(),
        status: 'NEW_ORDER'
      };

      // 1. Prepare WhatsApp redirect
      const waMsg = formatWhatsAppMessage(orderPayload, settings);
      const waUrl = getWhatsAppUrl(OWNER_WHATSAPP_TARGET, waMsg);

      // 2. Open WhatsApp immediately to avoid popup blocker
      openWhatsAppDirectly(waUrl);

      // 3. Submit to Google Sheets via Apps Script Web App in background
      submitOrderToScript(orderPayload, settings.googleScriptUrl).catch((err) => {
        console.warn('Google Sheet background logging notice:', err);
      });

      // 4. Trigger app success state
      onOrderSuccess(orderPayload);
      
      // Reset all fields
      setRequestText('');
      setCustomerName('');
      setPhone('');
      setLocationText('');
      onClose();
    } catch (err: any) {
      console.error('Order submission error:', err);
      setValidationError('Failed to send order. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="just-order-modal-overlay"
      className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden"
      onClick={onClose}
    >
      <div
        id="just-order-modal-content"
        className="bg-[#FDFCFB] rounded-t-3xl sm:rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E7E5E0] flex flex-col max-h-[92dvh] sm:max-h-[90vh] animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="pt-2 pb-1 flex justify-center sm:hidden bg-white shrink-0">
          <div className="w-12 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Clean Header */}
        <div className="px-5 py-3.5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-lg shrink-0 border border-orange-100">
              🛵
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 leading-tight">
                Just Order
              </h3>
              <p className="text-xs text-gray-400 font-normal">
                Custom local shop order
              </p>
            </div>
          </div>
          <button
            id="close-just-order-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice */}
        <div className="bg-orange-50/80 border-b border-orange-100/80 px-5 py-2.5 flex items-center gap-2 text-xs text-orange-900 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
          <p className="leading-tight font-medium">
            Write any item from any shop in Banhatti
          </p>
        </div>

        {/* Form with Scrollable Body and Sticky Action Footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4 touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {validationError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Items Needed */}
            <div>
              <label htmlFor="just-order-text" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Items Needed <span className="text-orange-500">*</span>
              </label>
              <textarea
                id="just-order-text"
                rows={3}
                required
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="e.g. 2 kg Sona Masoori rice, 1 box Mysore Pak from Gurunath Sweets, and medicines from Apollo."
                className="w-full text-base sm:text-sm p-3 rounded-xl border border-gray-200 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-gray-400 text-gray-900 resize-none"
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="just-order-name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Your Name <span className="text-orange-500">*</span>
              </label>
              <input
                id="just-order-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="e.g. Anand Pattar"
                className="w-full text-base sm:text-sm px-3.5 py-3 rounded-xl border border-gray-200 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="just-order-phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Mobile Number <span className="text-orange-500">*</span> <span className="text-gray-400 font-normal lowercase">(10 digits)</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm font-semibold text-gray-400 pointer-events-none select-none">
                  +91
                </span>
                <input
                  id="just-order-phone"
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
                  onFocus={handleInputFocus}
                  placeholder="8988846666"
                  className="w-full text-base sm:text-sm pl-12 pr-3.5 py-3 rounded-xl border border-gray-200 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none text-gray-900 placeholder:text-gray-400 font-medium tracking-wide font-mono"
                />
              </div>
            </div>

            {/* Delivery Location */}
            <div>
              <label htmlFor="just-order-location" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Delivery Address / Landmark <span className="text-gray-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                id="just-order-location"
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="e.g. Somwar Peth, near Basaveshwara Temple, Banhatti"
                className="w-full text-base sm:text-sm px-3.5 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <p className="text-[11px] text-gray-400 text-center pb-2">
              💡 Our rider will purchase the requested items from the local store and deliver to your doorstep.
            </p>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-3.5 sm:p-4 bg-white border-t border-gray-100 shrink-0 flex items-center gap-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              id="cancel-just-order-btn"
              onClick={onClose}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Cancel
            </button>
            <button
              id="submit-just-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md shadow-orange-500/20 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Sending Request...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 shrink-0" />
                  <span>Confirm & Place Order</span>
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
