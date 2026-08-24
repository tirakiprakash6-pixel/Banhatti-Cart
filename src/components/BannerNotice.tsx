import React from 'react';
import { PhoneCall, ShieldCheck, Clock, Info } from 'lucide-react';
import { AppSettings } from '../types';

interface BannerNoticeProps {
  settings: AppSettings;
}

export const BannerNotice: React.FC<BannerNoticeProps> = ({ settings }) => {
  return (
    <div id="service-notice-banner" className="bg-[#F7F6F2] border-b border-[#E7E5E0] px-3 sm:px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 text-[#1A1A1A]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#FF6B35]">
              How it works
            </span>
            <span className="text-xs text-[#8C8A84]">•</span>
            <span className="text-xs font-serif italic text-[#1A1A1A]">100% Personal Local Concierge</span>
          </div>
          <p className="text-xs text-[#555550] leading-relaxed max-w-2xl">
            Choose from the catalog or tap <strong>Just Order</strong> for custom requests. We will call you to confirm items from authentic Banhatti shops, procure fresh, and deliver to you. Pay via Cash/UPI on delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1A1A1A] bg-white px-3 py-1.5 rounded-xl border border-[#E7E5E0] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B35]" />
            Pay on Delivery
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#555550] bg-white px-3 py-1.5 rounded-xl border border-[#E7E5E0] shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-[#8C8A84]" />
            7 AM – 10 PM
          </span>
        </div>
      </div>
    </div>
  );
};
