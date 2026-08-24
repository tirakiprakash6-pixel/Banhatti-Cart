import React from 'react';
import { X, FileText, PhoneCall, Truck, AlertTriangle } from 'lucide-react';
import { AppSettings } from '../types';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="terms-modal-overlay"
      className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="terms-modal-content"
        className="bg-[#FDFCFB] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E7E5E0] relative my-auto animate-scaleUp max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-black/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FF6B35] rounded-xl text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif italic text-lg text-white">Terms & Conditions</h3>
              <p className="text-[11px] text-[#A6A49F]">{settings.storeName} Local Concierge</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto text-xs sm:text-sm text-[#1A1A1A] space-y-4 leading-relaxed">
          <div className="p-3.5 bg-[#FFF3EE] rounded-2xl border border-[#FF6B35]/20 text-[#1A1A1A] text-xs">
            <strong>Business Model Notice:</strong> {settings.storeName} is a personal on-demand local purchasing and delivery service operated in Banhatti & Rabkhandi. We are NOT an open marketplace or retailer.
          </div>

          <div>
            <h4 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-[#FF6B35]" />
              1. Order Confirmation via Phone Call
            </h4>
            <p className="text-[#666663] text-xs">
              Submitting an order on this website constitutes a delivery request. All orders are subject to manual confirmation over phone call to verify item availability in local merchant shops.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#FF6B35]" />
              2. Product Prices & Delivery Fees
            </h4>
            <p className="text-[#666663] text-xs">
              Catalog prices represent estimated local shop rates. Actual receipt/shop billing amounts will be communicated to you during the confirmation call. The delivery fee is manually determined based on distance and order size, and agreed upon before we make the purchase.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FF6B35]" />
              3. Payment & Cancellations
            </h4>
            <p className="text-[#666663] text-xs">
              Payment is accepted via UPI (Google Pay, PhonePe, Paytm) or Cash upon delivery. Once custom or perishable items (e.g., fresh cooked breakfast, cut pastries, custom cakes) are purchased from the merchant after phone confirmation, cancellation may not be permitted.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#F7F6F2] border-t border-[#E7E5E0]">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
