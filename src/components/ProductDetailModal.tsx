import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  quantityInCart?: number;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onDirectOrder?: (product: Product, quantity?: number) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  currencySymbol: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onDirectOrder,
  currencySymbol
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
    }
  }, [product]);

  if (!product) return null;

  const rawImages: string[] = [];
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    rawImages.push(...product.images);
  } else if ((product as any).image) {
    rawImages.push((product as any).image);
  } else if ((product as any).imageUrl) {
    rawImages.push((product as any).imageUrl);
  }

  // Filter valid URLs and remove duplicates
  const images = Array.from(
    new Set(rawImages.filter((img) => typeof img === 'string' && img.trim().length > 0))
  );

  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1542838132-92c53300491e?w=600');
  }

  const hasOffer = product.offerPrice && product.offerPrice < product.price;
  const currentPrice = hasOffer ? product.offerPrice! : product.price;
  const discountPercent = hasOffer ? Math.round(((product.price - currentPrice) / product.price) * 100) : 0;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleOrderNow = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (onDirectOrder) {
      onDirectOrder(product, 1);
    }
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-content"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs transition-transform active:scale-95 cursor-pointer shadow-md"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Images Carousel */}
        <div className="relative aspect-4/3 sm:aspect-16/10 bg-slate-900 overflow-hidden">
          <img
            src={images[activeImageIndex]}
            alt={`${product.name} photo ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';
            }}
          />

          {/* Offer Badge */}
          {hasOffer && (
            <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
              Save {discountPercent}%
            </span>
          )}

          {/* Carousel Arrows if multiple images */}
          {images.length > 1 && (
            <>
              <button
                id="gallery-prev-btn"
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                id="gallery-next-btn"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Dots indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'bg-amber-400 w-5' : 'bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Strip for multiple images only */}
        {images.length > 1 && (
          <div className="flex gap-2 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto">
            {images.slice(0, 4).map((imgUrl, idx) => (
              <button
                key={idx}
                id={`thumb-btn-${idx}`}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-600/30' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Details & Action Body */}
        <div className="p-4 sm:p-6 bg-[#FDFCFB]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] bg-[#F7F6F2] border border-[#E7E5E0] px-2.5 py-1 rounded-md w-fit">
              <span>{product.category}</span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif italic text-[#1A1A1A] mt-2 leading-snug">
            {product.name}
          </h3>

          {product.unit && (
            <p className="text-[11px] uppercase tracking-wider font-semibold text-[#8C8A84] mt-0.5">
              Portion: {product.unit}
            </p>
          )}

          <p className="text-xs sm:text-sm text-[#666663] mt-3 leading-relaxed bg-[#F7F6F2] p-3.5 rounded-2xl border border-[#E7E5E0]">
            {product.description}
          </p>

          {/* Pricing Row */}
          <div className="mt-4 flex items-center justify-between p-3.5 bg-[#F7F6F2] border border-[#E7E5E0] rounded-2xl">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#8C8A84] block font-medium">
                Estimated Item Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  {currencySymbol}{currentPrice}
                </span>
                {hasOffer && (
                  <span className="text-sm text-[#8C8A84] line-through">
                    {currencySymbol}{product.price}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Note */}
          <p className="text-[11px] text-[#8C8A84] mt-3 text-center">
            💡 We buy fresh from local Banhatti shops upon call confirmation. Pay cash/UPI upon delivery.
          </p>

          {/* Single Direct Order Button */}
          <div className="mt-4">
            <button
              id="modal-direct-order-btn"
              type="button"
              onClick={handleOrderNow}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#FF6B35] hover:bg-[#E85D2A] active:bg-[#D94F1C] text-white font-bold text-sm sm:text-base rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Order Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

