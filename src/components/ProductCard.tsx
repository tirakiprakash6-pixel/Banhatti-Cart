import React from 'react';
import { Plus, Minus, Eye, Check, Image as ImageIcon, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onDirectOrder?: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onViewDetails: (product: Product) => void;
  currencySymbol: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onDirectOrder,
  onUpdateQuantity,
  onViewDetails,
  currencySymbol
}) => {
  const hasOffer = product.offerPrice && product.offerPrice < product.price;
  const currentPrice = hasOffer ? product.offerPrice! : product.price;
  const discountPercent = hasOffer ? Math.round(((product.price - currentPrice) / product.price) * 100) : 0;
  const primaryImage = product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';
  const totalImages = product.images ? product.images.length : 1;

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between group"
    >
      {/* Product Image Area */}
      <div
        className="relative aspect-4/3 bg-gray-50 cursor-pointer overflow-hidden"
        onClick={() => onViewDetails(product)}
      >
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';
          }}
        />

        {/* Discount Badge */}
        {hasOffer && (
          <span className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Multiple photos indicator badge */}
        {totalImages > 1 && (
          <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
            <ImageIcon className="w-2.5 h-2.5" />
            <span>{totalImages} photos</span>
          </span>
        )}
      </div>

      {/* Product Details Area */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <h4
            onClick={() => onViewDetails(product)}
            className="font-bold text-xs sm:text-sm text-gray-900 leading-snug cursor-pointer hover:text-orange-600 transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </h4>

          {product.unit && (
            <span className="text-[10px] font-medium text-gray-400 block mt-0.5">
              {product.unit}
            </span>
          )}

          <p
            onClick={() => onViewDetails(product)}
            className="text-[11px] sm:text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed cursor-pointer"
          >
            {product.description}
          </p>
        </div>

        {/* Price and Cart Controls */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-bold text-gray-900">
                {currencySymbol}{currentPrice}
              </span>
              {hasOffer && (
                <span className="text-[11px] text-gray-400 line-through">
                  {currencySymbol}{product.price}
                </span>
              )}
            </div>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-medium">
              Shop Price
            </span>
          </div>

          {/* Dual Action Buttons: Add to Cart (with interactive + / - controls) AND Order Button */}
          <div className="flex items-center gap-1.5">
            {/* 1. Add to Cart / Quantity Stepper Control */}
            {quantityInCart === 0 ? (
              <button
                id={`add-cart-btn-${product.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F0EFEB] hover:bg-[#E4E2DC] active:bg-[#DCDAD2] text-[#1A1A1A] font-bold text-xs rounded-xl border border-[#D5D3CC] transition-all active:scale-95 whitespace-nowrap cursor-pointer shadow-2xs"
                title="Add to Cart"
              >
                <Plus className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span>Add</span>
              </button>
            ) : (
              <div
                id={`cart-stepper-${product.id}`}
                className="flex items-center bg-[#F0EFEB] border border-[#D5D3CC] rounded-xl p-0.5 shadow-2xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  id={`cart-minus-btn-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateQuantity(product.id, quantityInCart - 1);
                  }}
                  className="w-6 h-6 rounded-lg bg-white hover:bg-gray-100 active:bg-gray-200 text-[#1A1A1A] flex items-center justify-center font-bold transition-all shadow-2xs cursor-pointer"
                  title="Reduce quantity in cart"
                  aria-label="Reduce quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-1.5 text-xs font-bold text-[#1A1A1A] min-w-[20px] text-center">
                  {quantityInCart}
                </span>
                <button
                  id={`cart-plus-btn-${product.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateQuantity(product.id, quantityInCart + 1);
                  }}
                  className="w-6 h-6 rounded-lg bg-white hover:bg-gray-100 active:bg-gray-200 text-[#1A1A1A] flex items-center justify-center font-bold transition-all shadow-2xs cursor-pointer"
                  title="Add more quantity in cart"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* 2. Direct Order Button */}
            <button
              id={`direct-order-btn-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                if (onDirectOrder) {
                  onDirectOrder(product, quantityInCart > 0 ? quantityInCart : 1);
                } else {
                  onAddToCart(product);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B35] hover:bg-[#E85D2A] active:bg-[#D94F1C] text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 whitespace-nowrap cursor-pointer"
              title="Order this product directly"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ORDER</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
