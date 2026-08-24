import React from 'react';
import { X, Shield, Lock, Eye, CheckCircle2 } from 'lucide-react';
import { AppSettings } from '../types';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="privacy-modal-overlay"
      className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="privacy-modal-content"
        className="bg-[#FDFCFB] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E7E5E0] relative my-auto animate-scaleUp max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#1A1A1A] text-white flex items-center justify-between border-b border-black/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FF6B35] rounded-xl text-white">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif italic text-lg text-white">Privacy Policy</h3>
              <p className="text-[11px] text-[#A6A49F]">{settings.storeName} • Banhatti Local Service</p>
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
            At <strong>{settings.storeName}</strong>, we respect your privacy. We are a direct local shopping & delivery concierge for Banhatti, Rabkhandi and nearby areas. We do not require accounts, passwords, or online credit card credentials.
          </div>

          <div>
            <h4 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6B35]" />
              1. Information We Collect
            </h4>
            <p className="text-[#666663] mb-2 text-xs">
              We collect only the bare minimum information required to deliver your goods:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#666663] text-xs">
              <li><strong>Customer Name:</strong> To identify you during order confirmation and delivery.</li>
              <li><strong>Phone Number:</strong> To call you to verify shop items, confirm final prices, and coordinate delivery.</li>
              <li><strong>Optional Current Location & GPS:</strong> To find your house or delivery landmark quickly. Sharing GPS coordinates is completely voluntary.</li>
              <li><strong>Order Request & Products:</strong> The list of items or custom request you wish us to purchase.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#FF6B35]" />
              2. How Your Information Is Used
            </h4>
            <p className="text-[#666663] text-xs">
              Your information is used strictly and exclusively for:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#666663] text-xs mt-1">
              <li>Processing your delivery requests.</li>
              <li>Calling you to confirm shop availability and delivery charges.</li>
              <li>Navigating to your delivery location.</li>
              <li>Providing personalized customer support.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#FF6B35]" />
              3. Data Protection & No 3rd-Party Selling
            </h4>
            <p className="text-[#666663] text-xs">
              We do not sell, rent, trade, or distribute your personal contact information to any third parties, advertisers, or marketing firms. We do not store sensitive payment details since transactions are conducted directly in cash or standard UPI upon delivery.
            </p>
          </div>

          <div className="pt-3 border-t border-[#E7E5E0] text-[#8C8A84] text-[10px] uppercase tracking-wider">
            Last updated: August 2026 • Banhatti, Bagalkot District, Karnataka.
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
