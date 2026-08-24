import React from 'react';
import { Shield, FileText, Phone, Heart } from 'lucide-react';
import { AppSettings } from '../types';

interface FooterProps {
  settings: AppSettings;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenJustOrder: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
}) => {
  return (
    <footer id="main-footer" className="w-full bg-white border-t border-gray-200 mt-12">
      <div className="max-w-2xl mx-auto px-5 py-8">
        {/* Brand and Description */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shrink-0">
              <span className="text-lg">🛵</span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 leading-tight">
                {settings.storeName || 'Banhatti Cart'}
              </h3>
              <p className="text-xs text-gray-500 font-normal">
                Rabkavi & Banhatti small delivery system
              </p>
            </div>
          </div>
        </div>

        {/* Quick Legal & Contact Links */}
        <div className="py-4 flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-xs font-medium text-gray-500">
          <button
            id="footer-privacy-btn"
            onClick={onOpenPrivacy}
            className="hover:text-gray-900 transition-colors flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-gray-400" />
            <span>Privacy Policy</span>
          </button>

          <button
            id="footer-terms-btn"
            onClick={onOpenTerms}
            className="hover:text-gray-900 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <span>Terms & Conditions</span>
          </button>

          <button
            id="footer-contact-btn"
            onClick={onOpenContact}
            className="hover:text-gray-900 transition-colors flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            <span>Contact Support</span>
          </button>
        </div>

        {/* Bottom Subtext */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <p>© {new Date().getFullYear()} {settings.storeName || 'Banhatti Cart'}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Delivering with care in Banhatti</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

