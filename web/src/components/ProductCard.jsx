import React from 'react';
import { Plus, Eye, Star, Check } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-2.5 sm:p-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200">
      <div>
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-50 mb-2.5">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
            {product.discount && (
              <span className="px-1.5 py-0.5 bg-rose-600 text-white text-[9px] font-bold rounded">
                {product.discount} OFF
              </span>
            )}
            {product.badge && !product.discount && (
              <span className="px-1.5 py-0.5 bg-slate-900/80 text-white text-[9px] font-medium rounded">
                {product.badge}
              </span>
            )}
          </div>

          {/* Quick view button */}
          <button
            onClick={() => onQuickView(product)}
            className="absolute bottom-1.5 right-1.5 p-1.5 bg-white/95 hover:bg-white text-slate-700 rounded-md shadow-xs opacity-0 group-hover:opacity-100 transition cursor-pointer"
            title="দ্রুত প্রিভিউ"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-400 font-medium text-[10px]">
            {product.category_name}
          </span>
          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
            <Star className="w-3 h-3 fill-amber-500" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition">
          {product.title_bn || product.title}
        </h3>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="mt-3 pt-2 border-t border-slate-100">
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-extrabold text-slate-900">
              ৳{product.price.toLocaleString()}
            </span>
            {product.original_price && (
              <span className="text-[10px] text-slate-400 line-through">
                ৳{product.original_price.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
            <Check className="w-2.5 h-2.5" /> ইন-স্টক
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full py-2 px-3 bg-slate-900 hover:bg-indigo-600 active:scale-98 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> কার্টে যোগ করুন
        </button>
      </div>
    </div>
  );
}
