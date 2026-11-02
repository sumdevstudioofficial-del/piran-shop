import React, { useState, useEffect } from 'react';
import { Flame, Clock, Plus, Eye, Star } from 'lucide-react';

export default function FlashDeals({ deals, onAddToCart, onQuickView }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 14, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!deals || deals.length === 0) return null;

  return (
    <section className="py-6 sm:py-8 bg-rose-50/40 border-b border-rose-100/60">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header with Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Flame className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  ফ্ল্যাশ ডিলস
                </h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                  সীমিত অফার
                </span>
              </div>
              <p className="text-[11px] text-slate-500">বিশেষ মূল্যছাড়ের নির্ধারিত সময়সীমা</p>
            </div>
          </div>

          {/* Clean Countdown Box */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-rose-200/90 shadow-2xs self-start sm:self-auto text-xs">
            <Clock className="w-3.5 h-3.5 text-rose-600" />
            <span className="text-slate-500 text-[11px]">সময় বাকি:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-xs text-rose-700">
              <span className="bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Deals Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {deals.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 p-2.5 sm:p-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 mb-2.5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded">
                    {item.discount} ছাড়
                  </span>

                  <button
                    onClick={() => onQuickView(item)}
                    className="absolute bottom-1.5 right-1.5 p-1.5 bg-white/95 hover:bg-white text-slate-700 rounded-md shadow-xs opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="প্রিভিউ"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex items-center gap-1 text-amber-500 text-[11px] mb-1">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span className="font-bold text-slate-800">{item.rating}</span>
                  <span className="text-slate-400">({item.reviews_count})</span>
                </div>

                <h3 className="font-medium text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition">
                  {item.title_bn || item.title}
                </h3>
              </div>

              {/* Price & Action */}
              <div className="mt-3 pt-2 border-t border-slate-100">
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-sm sm:text-base font-extrabold text-slate-900">
                    ৳{item.price.toLocaleString()}
                  </span>
                  {item.original_price && (
                    <span className="text-[10px] text-slate-400 line-through">
                      ৳{item.original_price.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onAddToCart(item)}
                  className="w-full py-2 bg-slate-900 hover:bg-indigo-600 active:scale-98 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> কার্টে যোগ করুন
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
