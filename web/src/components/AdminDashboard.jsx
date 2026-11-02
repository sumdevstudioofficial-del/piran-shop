import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Truck, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Phone, 
  MapPin, 
  Eye, 
  LogOut, 
  LayoutDashboard, 
  AlertCircle,
  Search,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboard({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onDeleteProduct,
  categories
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'add_product'

  // Orders loaded from localStorage & initial mock
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // New Product Form State
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newCategory, setNewCategory] = useState('gadgets');
  const [newPrice, setNewPrice] = useState('');
  const [newOrigPrice, setNewOrigPrice] = useState('');
  const [newStock, setNewStock] = useState('20');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isFlash, setIsFlash] = useState(false);
  const [productSuccessMsg, setProductSuccessMsg] = useState('');

  // Load orders from localStorage
  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('piran_orders') || '[]');
      if (savedOrders.length === 0) {
        // Seed default sample order for preview
        const seedOrder = {
          order_id: 'PIRAN-841920',
          customer: { name: 'মোঃ রাকিবুল হাসান', phone: '01712345678' },
          shipping_address: 'বাসা #১২ (৩য় তলা), রোড #৫, ব্লক-ডি, মিরপুর-১০, থানা: মিরপুর, জেলা: ঢাকা, বিভাগ: ঢাকা',
          pricing: { total: 3850, subtotal: 3850, delivery_fee: 0 },
          payment: { method: 'cod', status: 'Cash on Delivery' },
          items: [{ title_bn: 'স্মার্ট ওয়াচ আল্ট্রা ২', price: 3850, quantity: 1 }],
          status: 'Processing',
          status_bn: 'প্রক্রিয়াধীন রয়েছে',
          created_at: new Date().toISOString()
        };
        setOrders([seedOrder]);
        localStorage.setItem('piran_orders', JSON.stringify([seedOrder]));
      } else {
        setOrders(savedOrders);
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === 'admin123' || pin === '1234') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন (টেস্টিং পিন: admin123)');
    }
  };

  // Change Order Status
  const handleStatusChange = (orderId, newStatus, newStatusBn) => {
    const updated = orders.map((o) =>
      o.order_id === orderId ? { ...o, status: newStatus, status_bn: newStatusBn } : o
    );
    setOrders(updated);
    try {
      localStorage.setItem('piran_orders', JSON.stringify(updated));
    } catch (e) {}
  };

  // Submit New Product
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newTitleBn.trim() || !newPrice) {
      alert('পণ্যের নাম এবং মূল্য আবশ্যক।');
      return;
    }

    const priceNum = parseFloat(newPrice);
    const origPriceNum = newOrigPrice ? parseFloat(newOrigPrice) : priceNum + 500;
    const discountPct = Math.round(((origPriceNum - priceNum) / origPriceNum) * 100);

    const categoryObj = categories.find((c) => c.id === newCategory);

    const newProd = {
      id: 'prod-' + Date.now(),
      title: newTitleEn || newTitleBn,
      title_bn: newTitleBn,
      category: newCategory,
      category_name: categoryObj ? categoryObj.name : 'সাধারণ',
      price: priceNum,
      original_price: origPriceNum,
      discount: discountPct > 0 ? `${discountPct}%` : '',
      rating: 5.0,
      reviews_count: 1,
      stock: parseInt(newStock, 10) || 10,
      is_flash_deal: isFlash,
      badge: isFlash ? 'Flash Deal' : 'New Arrival',
      image: newImage.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      description: newDesc.trim() || 'উন্নত মানের প্রিমিয়াম প্রডাক্ট।'
    };

    onAddProduct(newProd);

    // Reset Form
    setNewTitleBn('');
    setNewTitleEn('');
    setNewPrice('');
    setNewOrigPrice('');
    setNewImage('');
    setNewDesc('');
    setIsFlash(false);

    setProductSuccessMsg('🎉 পণ্যটি সফলভাবে স্টোরে যুক্ত হয়েছে!');
    setTimeout(() => {
      setProductSuccessMsg('');
      setActiveTab('products');
    }, 1500);
  };

  // Stats Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'Processing').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'Delivered').length;

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter =
      orderFilter === 'all' || o.status.toLowerCase() === orderFilter.toLowerCase();
    const query = orderSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      o.order_id.toLowerCase().includes(query) ||
      o.customer?.name?.toLowerCase().includes(query) ||
      o.customer?.phone?.includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto min-h-[550px] flex flex-col">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Piran Shop • অ্যাডমিন কন্ট্রোল প্যানেল
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  লাইভ
                </span>
              </div>
              <p className="text-[11px] text-slate-400">স্টোর ও অর্ডার ম্যানেজমেন্ট সিস্টেম</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Login Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">অ্যাডমিন লগইন</h3>
              <p className="text-xs text-slate-500 mt-1 mb-5">
                কন্ট্রোল প্যানেলে প্রবেশ করতে আপনার সিক্রেট পিন দিন
              </p>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  required
                  placeholder="পিন বা পাসওয়ার্ড দিন"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 text-center font-mono tracking-widest text-base outline-hidden"
                />

                {pinError && (
                  <p className="text-xs text-rose-600 font-medium">{pinError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
                >
                  প্রবেশ করুন
                </button>
              </form>

              <div className="mt-4 p-2.5 rounded-xl bg-slate-100 text-[11px] text-slate-500 font-mono">
                ডিফল্ট পাসওয়ার্ড: <span className="font-bold text-slate-800">admin123</span>
              </div>
            </div>
          </div>
        ) : (
          /* 2. Main Authenticated Dashboard */
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
            {/* Stats Overview Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-5 bg-white border-b border-slate-200">
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <span className="text-[11px] font-bold text-indigo-600">মোট বিক্রয় (Revenue)</span>
                <p className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  ৳{totalRevenue.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-[11px] font-bold text-amber-700">মোট অর্ডার</span>
                <p className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {totalOrdersCount} টি
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
                <span className="text-[11px] font-bold text-sky-700">পেন্ডিং ডেলিভারি</span>
                <p className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {pendingOrdersCount} টি
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-700">মোট লাইভ পণ্য</span>
                <p className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {products.length} টি
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-5 pt-3 bg-white border-b border-slate-200 flex gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-2.5 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>গ্রাহকের অর্ডারসমূহ ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`pb-2.5 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'products'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>পণ্য তালিকা ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('add_product')}
                className={`pb-2.5 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'add_product'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন পণ্য যোগ করুন</span>
              </button>
            </div>

            {/* Tab 1: Orders Management */}
            {activeTab === 'orders' && (
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3">
                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-2.5 justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="অর্ডার আইডি, নাম বা ফোন নম্বর খুঁজুন..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-hidden focus:border-indigo-600"
                    />
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto text-xs">
                    {['all', 'Processing', 'Shipped', 'Delivered'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setOrderFilter(filter)}
                        className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                          orderFilter === filter
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {filter === 'all'
                          ? 'সকল'
                          : filter === 'Processing'
                          ? 'পেন্ডিং'
                          : filter === 'Shipped'
                          ? 'ডেলিভারির পথে'
                          : 'সম্পন্ন'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders List Table / Cards */}
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.order_id}
                        className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-600 text-sm">
                              {order.order_id}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              • {new Date(order.created_at || Date.now()).toLocaleDateString('bn-BD')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Status Change Selector */}
                            <select
                              value={order.status}
                              onChange={(e) => {
                                const val = e.target.value;
                                const bn =
                                  val === 'Processing'
                                    ? 'প্রক্রিয়াধীন রয়েছে'
                                    : val === 'Shipped'
                                    ? 'ডেলিভারির পথে রয়েছে'
                                    : val === 'Delivered'
                                    ? 'সফল ডেলিভারি হয়েছে'
                                    : 'অর্ডার বাতিল';
                                handleStatusChange(order.order_id, val, bn);
                              }}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-hidden cursor-pointer ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : order.status === 'Shipped'
                                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              <option value="Processing">🟡 প্রসেসিং (Pending)</option>
                              <option value="Shipped">🔵 ডেলিভারির পথে (Shipped)</option>
                              <option value="Delivered">🟢 ডেলিভারি সম্পন্ন (Delivered)</option>
                              <option value="Cancelled">🔴 বাতিল (Cancelled)</option>
                            </select>
                          </div>
                        </div>

                        {/* Customer & Address Details */}
                        <div className="grid sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span>👤 {order.customer?.name}</span>
                            </p>
                            <p className="text-slate-500 mt-0.5 flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="font-mono font-semibold">{order.customer?.phone}</span>
                            </p>
                            <p className="text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                              <MapPin className="w-3.5 h-3.5 text-indigo-600 inline mr-1" />
                              {order.shipping_address}
                            </p>
                          </div>

                          <div className="space-y-1.5 sm:border-l sm:border-slate-100 sm:pl-3">
                            <p className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                              অর্ডারকৃত পণ্যসমূহ:
                            </p>
                            <div className="space-y-1">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-slate-600 text-xs">
                                  <span className="line-clamp-1">{item.title_bn || item.title} (x{item.quantity})</span>
                                  <span className="font-bold">৳{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex justify-between font-black text-sm text-slate-900">
                              <span>মোট বিল ({order.payment?.method === 'bkash' ? 'বিকাশ' : 'ক্যাশ অন ডেলিভারি'}):</span>
                              <span className="text-indigo-600">৳{order.pricing?.total?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Products List Management */}
            {activeTab === 'products' && (
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-slate-800">
                    বর্তমানে স্টোরে মোট {products.length} টি পণ্য লাইভ আছে
                  </h3>
                  <button
                    onClick={() => setActiveTab('add_product')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> নতুন পণ্য যোগ
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white p-3 rounded-2xl border border-slate-200 flex gap-3 items-center justify-between shadow-2xs hover:border-slate-300"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          {p.category_name}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                          {p.title_bn || p.title}
                        </h4>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-xs font-black text-indigo-600">৳{p.price}</span>
                          <span className="text-[10px] text-slate-400">স্টক: {p.stock}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${p.title_bn || p.title}" পণ্যটি মুছে ফেলতে চান?`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                        title="পণ্য ডিলিট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Add New Product Form */}
            {activeTab === 'add_product' && (
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-w-2xl mx-auto w-full">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-slate-900">নতুন পণ্য যোগ করুন</h3>
                  <p className="text-xs text-slate-500">
                    নিচের তথ্যগুলো পূরণ করলেই সাথে সাথে পণ্যটি আপনার লাইভ ওয়েবসাইটে যুক্ত হয়ে যাবে
                  </p>
                </div>

                {productSuccessMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{productSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      পণ্যের নাম (বাংলা) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: পুরুষদের প্রিমিয়াম সিল্ক পাঞ্জাবি"
                      value={newTitleBn}
                      onChange={(e) => setNewTitleBn(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি *</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden bg-white"
                      >
                        {categories.filter(c => c.id !== 'all').map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">স্টক সংখ্যা</label>
                      <input
                        type="number"
                        placeholder="20"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">বিক্রয় মূল্য (৳) *</label>
                      <input
                        type="number"
                        required
                        placeholder="যেমন: 2500"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">আগের মূল্য / স্ট্রাইক (৳)</label>
                      <input
                        type="number"
                        placeholder="যেমন: 3200"
                        value={newOrigPrice}
                        onChange={(e) => setNewOrigPrice(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পণ্যের ছবির লিংক (Image URL)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      খালি রাখলে স্বয়ংক্রিয়ভাবে একটি চমৎকার প্রোডাক্ট ইমেজ বসে যাবে।
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পণ্যের বিবরণ (Description)</label>
                    <textarea
                      rows={2}
                      placeholder="পণ্যের ফেব্রিক, ফিচার বা বিবরণ লিখুন..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-indigo-600 outline-hidden"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="flashCheck"
                      checked={isFlash}
                      onChange={(e) => setIsFlash(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                    <label htmlFor="flashCheck" className="text-slate-700 font-medium cursor-pointer">
                      এই পণ্যটি "ফ্ল্যাশ ডিলস (Flash Sale)" সেকশনে প্রদর্শন করুন
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md mt-2"
                  >
                    পণ্যটি ওয়েবসাইটে পাবলিশ করুন 🚀
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
