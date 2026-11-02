import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, Plus, Minus, ShoppingCart } from 'lucide-react';

export default function ProductQuickView({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto bg-slate-100 flex items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-80 w-full object-cover rounded-2xl shadow-md"
            />
            {product.discount && (
              <span className="absolute top-6 left-6 px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md">
                {product.discount} ছাড়
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                {product.category_name}
              </span>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-snug">
                {product.title_bn || product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span className="ml-1 font-bold text-slate-800">{product.rating}</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{product.reviews_count} টি কাস্টমার রিভিউ</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 font-bold">স্টকে আছে</span>
              </div>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-black text-slate-900">
                  ৳{(product.price * qty).toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="text-base text-slate-400 line-through">
                    ৳{(product.original_price * qty).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Assurances */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>১০০% অরিজিনাল প্রোডাক্ট</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>সারা দেশে হোম ডেলিভারি</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-slate-600 cursor-pointer transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-slate-800">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-slate-600 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product, qty);
                  onClose();
                }}
                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" /> কার্টে যোগ করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
