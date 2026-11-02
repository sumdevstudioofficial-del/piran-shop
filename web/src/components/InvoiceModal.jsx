import React from 'react';
import { X, Printer, Download, CheckCircle2, ShoppingBag, Phone, MapPin, Truck } from 'lucide-react';

export default function InvoiceModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.created_at || Date.now()).toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const subtotal = order.pricing?.subtotal || order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const deliveryFee = order.pricing?.delivery_fee !== undefined ? order.pricing.delivery_fee : 0;
  const total = order.pricing?.total || subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base">অর্ডার মেমো ও ইনভয়েস</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-600 font-bold text-white">
              {order.order_id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>ইনভয়েস প্রিন্ট করুন</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 sm:p-10 text-slate-800 font-sans print:p-8" id="printable-invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                  P
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">PIRAN SHOP</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">আধুনিক অনলাইন মার্কেটপ্লেস ও রিটেল শপ</p>
              <p className="text-xs text-slate-500 mt-1">মিরপুর ডিওএইচএস, ঢাকা, বাংলাদেশ</p>
              <p className="text-xs text-slate-500">হটলাইন: ০১800-PIRAN | help@piranshop.online</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">ট্রেড লাইসেন্স: TRAD/DNCC/2026</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-black text-xs uppercase tracking-wider rounded-md mb-2">
                ক্যাশ মেমো / ইনভয়েস
              </span>
              <p className="text-sm font-bold text-slate-900 font-mono">
                ইনভয়েস নং: <span className="text-indigo-600 font-extrabold">{order.order_id}</span>
              </p>
              <p className="text-xs text-slate-600 mt-0.5">তারিখ: {invoiceDate}</p>
              <p className="text-xs text-slate-600">
                পেমেন্ট মেথড: <span className="font-bold text-slate-800">{order.payment?.method === 'cod' ? 'ক্যাশ অন ডেলিভারি' : 'অনলাইন পেমেন্ট'}</span>
              </p>
            </div>
          </div>

          {/* Customer & Courier Details Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                গ্রাহকের তথ্য (Bill To):
              </span>
              <h4 className="text-sm font-extrabold text-slate-900">{order.customer?.name}</h4>
              <p className="font-mono font-semibold text-slate-700 mt-0.5">মোবাইল: {order.customer?.phone}</p>
              <p className="text-slate-600 mt-1 leading-relaxed">{order.shipping_address}</p>
            </div>

            <div className="sm:border-l sm:border-slate-200 sm:pl-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                ডেলিভারি ও কুরিয়ার বিবরণ:
              </span>
              {order.courier_info ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-bold text-slate-900">{order.courier_info.provider}</span>
                  </div>
                  <p className="font-mono text-xs">
                    ট্র্যাকিং কোড: <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{order.courier_info.tracking_code}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">স্ট্যাটাস: ডেলিভারির পথে (Shipped)</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-slate-700 font-semibold">কুরিয়ার: হোম ডেলিভারি এক্সপ্রেস</p>
                  <p className="text-slate-500">আনুমানিক ডেলিভারি: ২-৩ কার্যদিবসের মধ্যে</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">পণ্যের বিবরণ</th>
                  <th className="py-2.5 px-3 text-center">একক মূল্য</th>
                  <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                  <th className="py-2.5 px-3 text-right">মোট টাকা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items?.map((item, index) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 text-slate-400 font-mono">{index + 1}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{item.title_bn || item.title}</span>
                        {item.title && item.title_bn && (
                          <span className="text-[11px] text-slate-400">{item.title}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">৳{item.price.toLocaleString()}</td>
                      <td className="py-3 px-3 text-center font-bold font-mono">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-extrabold font-mono text-slate-900">
                        ৳{lineTotal.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary */}
          <div className="flex justify-end my-4">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>পণ্যের মোট মূল্য (Subtotal):</span>
                <span className="font-mono font-bold">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-mono font-bold">
                  {deliveryFee === 0 ? 'ফ্রি (০৳)' : `৳${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t-2 border-slate-900">
                <span>সর্বমোট প্রদেয় (Total COD):</span>
                <span className="font-mono text-indigo-600 text-base">৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Terms & Signatures */}
          <div className="pt-6 mt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
              <div className="text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700">শর্তাবলী ও রিটার্ন পলিসি:</p>
                <p>• পণ্য ডেলিভারিম্যানের সামনে চেক করে গ্রহণ করুন।</p>
                <p>• যেকোনো ত্রুটিতে ৭ দিনের মধ্যে রিটার্ন বা রিপ্লেসমেন্ট পাবেন।</p>
                <p>• পিরান শপ-এর সাথে থাকার জন্য ধন্যবাদ!</p>
              </div>

              <div className="flex justify-between sm:justify-end gap-10 pt-8 sm:pt-0 text-center text-xs text-slate-600">
                <div className="border-t border-slate-400 pt-1.5 px-4">
                  <span>অনুমোদিত স্বাক্ষর</span>
                </div>
                <div className="border-t border-slate-400 pt-1.5 px-4">
                  <span>গ্রাহকের স্বাক্ষর</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
