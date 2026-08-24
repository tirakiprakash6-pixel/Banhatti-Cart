import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  quantityInCart: number;
  onAddToCart: (product: Product, quantity?: number) => void;
  onDirectOrder?: (product: Product, quantity?: number) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  currencySymbol: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  quantityInCart,
  onAddToCart,
  onDirectOrder,
  onUpdateQuantity,
  currencySymbol
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [localQty, setLocalQty] = useState<number>(1);

  React.useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setLocalQty(quantityInCart > 0 ? quantityInCart : 1);
    }
  }, [product, quantityInCart]);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'];

  const hasOffer = product.offerPrice && product.offerPrice < product.price;
  const currentPrice = hasOffer ? product.offerPrice! : product.price;
  const discountPercent = hasOffer ? Math.round(((product.price - currentPrice) / product.price) * 100) : 0;

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSaveToCart = () => {
    if (quantityInCart === 0) {
      onAddToCart(product, localQty);
    } else {
      onUpdateQuantity(product.id, localQty);
    }
    onClose();
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
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs transition-transform active:scale-95"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Images Carousel (Up to 4 images) */}
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
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                id="gallery-next-btn"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-xs transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Dots / Count indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeImageIndex === idx ? 'bg-amber-400 w-5' : 'bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Strip for up to 4 images */}
        {images.length > 1 && (
          <div className="flex gap-2 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto">
            {images.slice(0, 4).map((imgUrl, idx) => (
              <button
                key={idx}
                id={`thumb-btn-${idx}`}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
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
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] bg-[#F7F6F2] border border-[#E7E5E0] px-2.5 py-1 rounded-md w-fit">
            <span>{product.category}</span>
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
              <span className="text-[10px] uppercase tracking-wider text-[#8C8A84] block font-medium">Estimated Item Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  {currencySymbol}{currentPrice * localQty}
                </span>
                {hasOffer && (
                  <span className="text-sm text-[#8C8A84] line-through">
                    {currencySymbol}{product.price * localQty}
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center bg-white border border-[#E7E5E0] rounded-xl p-1 shadow-2xs">
              <button
                id="modal-qty-minus"
                onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-[#F7F6F2] hover:bg-[#EAE8E2] text-[#1A1A1A] flex items-center justify-center font-bold transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-sm font-bold text-[#1A1A1A] min-w-[28px] text-center">
                {localQty}
              </span>
              <button
                id="modal-qty-plus"
                onClick={() => setLocalQty((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-[#F7F6F2] hover:bg-[#EAE8E2] text-[#1A1A1A] flex items-center justify-center font-bold transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Delivery Note */}
          <p className="text-[11px] text-[#8C8A84] mt-2.5 text-center">
            💡 We buy fresh from local Banhatti shops upon call confirmation. Pay cash/UPI upon delivery.
          </p>

          {/* Dual CTAs: Add to Cart AND Direct Order */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {/* 1. Add to Cart Button */}
            <button
              id="modal-add-to-cart-btn"
              onClick={handleSaveToCart}
              className="flex items-center justify-center gap-1.5 py-3 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{quantityInCart > 0 ? 'Update Cart' : 'Add to Cart'}</span>
            </button>

            {/* 2. Direct Order Button */}
            <button
              id="modal-direct-order-btn"
              onClick={() => {
                if (onDirectOrder) {
                  onDirectOrder(product, localQty);
                } else {
                  handleSaveToCart();
                }
              }}
              className="flex items-center justify-center gap-1.5 py-3 px-3 bg-[#FF6B35] hover:bg-[#E85D2A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
