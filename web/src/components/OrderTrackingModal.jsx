import React, { useState } from 'react';
import { X, Search, CheckCircle, Package, Truck, Home, Loader2, AlertCircle } from 'lucide-react';
import { trackOrder } from '../services/cloudDb';

export default function OrderTrackingModal({ isOpen, onClose }) {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const found = await trackOrder(orderId.trim());
      if (found) {
        setOrderData(found);
      } else {
        setError('এই নম্বরে কোনো অর্ডার পাওয়া যায়নি। সঠিক অর্ডার আইডি দিন।');
      }
    } catch (err) {
      console.error(err);
      setError('ট্র্যাকিংয়ের তথ্য পাওয়া যায়নি। সঠিক অর্ডার আইডি দিন।');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'অর্ডার গৃহীত', icon: CheckCircle, desc: 'অর্ডার সিস্টেম ভেরিফাই করেছে' },
    { label: 'প্রসেসিং', icon: Package, desc: 'পণ্য প্যাকিং ও কোয়ালিটি চেক' },
    { label: 'ডেলিভারির পথে', icon: Truck, desc: 'কুরিয়ার রাইডারের কাছে রয়েছে' },
    { label: 'ডেলিভারি সম্পন্ন', icon: Home, desc: 'গ্রাহকের হাতে সফলভাবে হস্তান্তর' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900">লাইভ অর্ডার ট্র্যাকিং</h2>
          <p className="text-xs text-slate-500">আপনার অর্ডারের বর্তমান অবস্থা লাইভ দেখুন</p>
        </div>

        {/* Search input */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="অর্ডার আইডি দিন (যেমন: PIRAN-542198)"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/10 text-sm outline-hidden font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ট্র্যাক করুন'}
          </button>
        </form>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2 border border-rose-200 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details & Timeline */}
        {orderData && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">গ্রাহক:</span>
                <span className="font-bold text-slate-900">{orderData.customer?.name} ({orderData.customer?.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ঠিকানা:</span>
                <span className="font-medium text-slate-800">{orderData.shipping_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">স্ট্যাটাস:</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                  {orderData.status_bn || orderData.status}
                </span>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-200">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isCurrent = idx <= 1; // simulation of processing step

                return (
                  <div key={idx} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div>
                      <h4 className={`text-xs font-bold ${isCurrent ? 'text-indigo-600' : 'text-slate-500'}`}>
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
