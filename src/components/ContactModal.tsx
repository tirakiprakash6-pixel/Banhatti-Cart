import React from 'react';
import { X, MapPin, Clock, Bike, ShieldCheck, Headphones } from 'lucide-react';
import { AppSettings } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onOpenJustOrder: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  settings,
  onOpenJustOrder
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="contact-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="contact-modal-content"
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 relative my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gray-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500 rounded-xl text-white">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Customer Support</h3>
              <p className="text-[11px] text-gray-400">Banhatti Local Delivery Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-100 text-gray-800 text-xs leading-relaxed">
            Have a question, special delivery request, or need a custom order? Our local delivery team is at your service.
          </div>

          <div className="space-y-2.5">
            {/* Service & Concierge Desk */}
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="p-2.5 bg-gray-900 text-white rounded-xl">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Support Desk
                </span>
                <span className="font-bold text-gray-900 text-xs sm:text-sm">
                  Banhatti Cart Verified Service
                </span>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="p-2.5 bg-gray-900 text-white rounded-xl">
                <Clock className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Service Hours
                </span>
                <span className="font-bold text-gray-900 text-xs">
                  Daily 7:00 AM – 10:00 PM (IST)
                </span>
              </div>
            </div>

            {/* Delivery Locations */}
            <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="p-2.5 bg-gray-900 text-white rounded-xl">
                <MapPin className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Coverage Area
                </span>
                <span className="font-bold text-gray-900 text-xs">
                  {settings.deliveryArea || 'Banhatti, Rabkhandi & nearby areas (Karnataka)'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenJustOrder();
              }}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Bike className="w-4 h-4" />
              <span>Request Custom Just Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
