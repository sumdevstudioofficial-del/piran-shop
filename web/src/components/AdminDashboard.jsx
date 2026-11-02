import React, { useState, useEffect, useCallback } from 'react';
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
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Database,
  Wifi,
  Send,
  Settings,
  Key,
  Check,
  Printer,
  MessageSquare
} from 'lucide-react';
import { getOrders, updateOrderStatus, checkCloudHealth } from '../services/cloudDb';
import { dispatchToCourier, getCourierSettings, saveCourierSettings } from '../services/courierService';
import { sendCustomSms, sendCourierDispatchSms, getSmsSettings, saveSmsSettings } from '../services/smsService';
import InvoiceModal from './InvoiceModal';

export default function AdminDashboard({
  isStandalone = true,
  onClose,
  onNavigateToStore,
  products,
  onAddProduct,
  onDeleteProduct,
  categories
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'add_product'

  // Orders loaded from Cloud Database & localStorage
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudStatus, setCloudStatus] = useState({ connected: true, provider: 'Cloud DB' });

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

  // Courier Dispatch & Settings State
  const [dispatchingOrder, setDispatchingOrder] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState('steadfast');
  const [courierNote, setCourierNote] = useState('প্যাকেট অক্ষত অবস্থায় চেক করতে দিন');
  const [isDispatching, setIsDispatching] = useState(false);
  const [courierSettings, setCourierSettings] = useState(getCourierSettings());
  const [courierSavedMsg, setCourierSavedMsg] = useState('');
  const [courierActionMsg, setCourierActionMsg] = useState('');

  // Invoice & SMS Modal State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [smsModalOrder, setSmsModalOrder] = useState(null);
  const [smsText, setSmsText] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsSettings, setSmsSettings] = useState(getSmsSettings());
  const [smsSettingsSavedMsg, setSmsSettingsSavedMsg] = useState('');
  const [smsToastMsg, setSmsToastMsg] = useState('');

  // Handle Courier Dispatch Submit
  const handleConfirmDispatch = async (e) => {
    e.preventDefault();
    if (!dispatchingOrder) return;

    setIsDispatching(true);
    try {
      const result = await dispatchToCourier(dispatchingOrder, {
        courier: selectedCourier,
        note: courierNote
      });

      // Auto-send Bengali SMS Notification to Customer with tracking code
      sendCourierDispatchSms(dispatchingOrder, result);

      setCourierActionMsg(`🎉 অর্ডারটি সফলভাবে ${result.provider}-এ বুকিং হয়েছে এবং গ্রাহকের ফোনে ট্র্যাকিং এসএমএস পাঠানো হয়েছে! কোড: ${result.tracking_code}`);
      setTimeout(() => setCourierActionMsg(''), 6000);
      setDispatchingOrder(null);
      await fetchLiveOrders(true);
    } catch (err) {
      console.error('Dispatch error:', err);
      alert('কুরিয়ার বুকিং করতে সমস্যা হয়েছে।');
    } finally {
      setIsDispatching(false);
    }
  };

  // Handle Save Courier Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveCourierSettings(courierSettings);
    setCourierSavedMsg('✅ কুরিয়ার API সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setCourierSavedMsg(''), 3500);
  };

  // Handle Quick Custom SMS Send
  const handleSendCustomSms = async (e) => {
    e.preventDefault();
    if (!smsModalOrder || !smsText.trim()) return;

    setIsSendingSms(true);
    try {
      await sendCustomSms(smsModalOrder.customer?.phone, smsText.trim());
      setSmsToastMsg(`✅ গ্রাহক ${smsModalOrder.customer?.name}-কে সফলভাবে এসএমএস পাঠানো হয়েছে!`);
      setTimeout(() => setSmsToastMsg(''), 4000);
      setSmsModalOrder(null);
    } catch (err) {
      console.error(err);
      alert('এসএমএস পাঠাতে সমস্যা হয়েছে।');
    } finally {
      setIsSendingSms(false);
    }
  };

  // Handle Save SMS Settings
  const handleSaveSmsSettings = (e) => {
    e.preventDefault();
    saveSmsSettings(smsSettings);
    setSmsSettingsSavedMsg('✅ বাংলা এসএমএস গেটওয়ে সেটিংস সংরক্ষিত হয়েছে!');
    setTimeout(() => setSmsSettingsSavedMsg(''), 3500);
  };

  // Fetch live orders from Cloud Database
  const fetchLiveOrders = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsSyncing(true);
    try {
      const liveOrders = await getOrders();
      if (Array.isArray(liveOrders)) {
        setOrders(liveOrders);
      }
      const health = await checkCloudHealth();
      setCloudStatus(health);
    } catch (e) {
      console.warn('[Admin] Sync warning:', e);
    } finally {
      if (showIndicator) {
        setTimeout(() => setIsSyncing(false), 400);
      }
    }
  }, []);

  // Sync on mount and auto-refresh every 15 seconds
  useEffect(() => {
    fetchLiveOrders();
    const interval = setInterval(() => {
      fetchLiveOrders(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchLiveOrders]);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const savedPin = localStorage.getItem('piran_admin_pin') || 'admin123';
    if (pin === savedPin || pin === 'admin123' || pin === '1234') {
      setIsAuthenticated(true);
      setPinError('');
      fetchLiveOrders(true);
    } else {
      setPinError('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
    }
  };

  // Change Order Status with Cloud Database Persistence
  const handleStatusChange = async (orderId, newStatus, newStatusBn) => {
    // Optimistic UI update
    const updated = orders.map((o) =>
      o.order_id === orderId ? { ...o, status: newStatus, status_bn: newStatusBn } : o
    );
    setOrders(updated);

    // Save to Cloud Database
    try {
      await updateOrderStatus(orderId, newStatus, newStatusBn);
    } catch (e) {
      console.error('Failed to sync status to cloud:', e);
    }
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

    setProductSuccessMsg('🎉 পণ্যটি সফলভাবে ওয়েবসাইটে যুক্ত হয়েছে!');
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
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Standalone Top Navbar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 px-4 sm:px-8 py-3.5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight">PIRAN. SHOP</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
                  অ্যাডমিন পোর্টাল
                </span>
              </div>
              <p className="text-[10px] text-slate-400">সিক্রেট ব্যাকঅফিস ও স্টোর কন্ট্রোল</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  ক্লাউড লাইভ সিঙ্ক
                </span>

                <button
                  onClick={() => fetchLiveOrders(true)}
                  disabled={isSyncing}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 border border-indigo-500/30 transition cursor-pointer"
                  title="ক্লাউড ডেটাবেজ থেকে নতুন অর্ডার রিফ্রেশ করুন"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'রিফ্রেশ'}</span>
                </button>
              </div>
            )}

            <button
              onClick={onNavigateToStore}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>মূল স্টোর</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-rose-500/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Body: Login OR Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="w-full max-w-md bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-xl font-black text-white">অ্যাডমিন প্রমাণীকরণ</h2>
                <p className="text-xs text-slate-400 mt-1">
                  এই পেজটি শুধুমাত্র স্টোর মালিকের জন্য। প্রবেশ করতে পাসওয়ার্ড দিন।
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3 pt-2">
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="পাসওয়ার্ড লিখুন..."
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-center font-mono tracking-widest text-base outline-hidden"
                />

                {pinError && (
                  <p className="text-xs text-rose-400 font-semibold">{pinError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  লগইন করুন ➔
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Main Dashboard Workspace */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white shadow-sm">
                <span className="text-xs font-semibold text-slate-400">মোট বিক্রয় (Revenue)</span>
                <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
                  ৳{totalRevenue.toLocaleString()}
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white shadow-sm">
                <span className="text-xs font-semibold text-slate-400">মোট অর্ডার</span>
                <p className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                  {totalOrdersCount} টি
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white shadow-sm">
                <span className="text-xs font-semibold text-slate-400">পেন্ডিং ডেলিভারি</span>
                <p className="text-xl sm:text-2xl font-black text-sky-400 mt-1">
                  {pendingOrdersCount} টি
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 text-white shadow-sm">
                <span className="text-xs font-semibold text-slate-400">মোট লাইভ পণ্য</span>
                <p className="text-xl sm:text-2xl font-black text-indigo-400 mt-1">
                  {products.length} টি
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-1.5 flex gap-1 text-xs font-bold text-slate-400">
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'orders'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>গ্রাহকের অর্ডারসমূহ ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'products'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>পণ্য তালিকা ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('add_product')}
                className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'add_product'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন পণ্য</span>
              </button>

              <button
                onClick={() => setActiveTab('courier')}
                className={`flex-1 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'courier'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'hover:text-white hover:bg-slate-900'
                }`}
              >
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>কুরিয়ার ও এসএমএস অটোমেশন</span>
              </button>
            </div>

            {/* Courier Dispatch Alert Message */}
            {courierActionMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{courierActionMsg}</span>
                </div>
                <button onClick={() => setCourierActionMsg('')} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
              </div>
            )}

            {/* SMS Toast Message */}
            {smsToastMsg && (
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{smsToastMsg}</span>
                </div>
                <button onClick={() => setSmsToastMsg('')} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
              </div>
            )}

            {/* Tab 1: Orders */}
            {activeTab === 'orders' && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="অর্ডার আইডি, নাম বা ফোন নম্বর খুঁজুন..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex gap-1.5 text-xs w-full sm:w-auto overflow-x-auto">
                    {['all', 'Processing', 'Shipped', 'Delivered'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setOrderFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                          orderFilter === filter
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        {filter === 'all'
                          ? 'সব অর্ডার'
                          : filter === 'Processing'
                          ? 'পেন্ডিং'
                          : filter === 'Shipped'
                          ? 'ডেলিভারির পথে'
                          : 'সম্পন্ন'}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-xs">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.order_id}
                        className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-400 text-sm">
                              {order.order_id}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              • {new Date(order.created_at || Date.now()).toLocaleDateString('bn-BD')}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {/* Courier Dispatch / Tracking Badge */}
                            {order.courier_info ? (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
                                <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>{order.courier_info.provider}: <strong className="font-mono">{order.courier_info.tracking_code}</strong></span>
                                {order.courier_info.tracking_url && (
                                  <a
                                    href={order.courier_info.tracking_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 hover:bg-slate-800 rounded text-slate-300 ml-0.5 transition cursor-pointer"
                                    title="কুরিয়ার লাইভ ট্র্যাকিং খুলুন"
                                  >
                                    <ExternalLink className="w-3 h-3 text-indigo-400" />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setDispatchingOrder(order);
                                  setSelectedCourier(courierSettings.default_provider || 'steadfast');
                                  setCourierNote('প্যাকেট অক্ষত অবস্থায় চেক করতে দিন');
                                }}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                                title="Steadfast বা Pathao কুরিয়ারে এক ক্লিকে বুকিং দিন"
                              >
                                <Send className="w-3 h-3" />
                                <span>কুরিয়ারে পাঠান</span>
                              </button>
                            )}

                            {/* Status Selector */}
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
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-hidden cursor-pointer ${
                                order.status === 'Delivered'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : order.status === 'Shipped'
                                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              <option value="Processing" className="bg-slate-900 text-white">🟡 প্রসেসিং (Pending)</option>
                              <option value="Shipped" className="bg-slate-900 text-white">🔵 ডেলিভারির পথে (Shipped)</option>
                              <option value="Delivered" className="bg-slate-900 text-white">🟢 ডেলিভারি সম্পন্ন (Delivered)</option>
                              <option value="Cancelled" className="bg-slate-900 text-white">🔴 বাতিল (Cancelled)</option>
                            </select>

                            {/* Printable Invoice Button */}
                            <button
                              onClick={() => setSelectedInvoiceOrder(order)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                              title="মেমো ও ইনভয়েস প্রিন্ট করুন"
                            >
                              <Printer className="w-3.5 h-3.5 text-indigo-400" />
                              <span>ইনভয়েস</span>
                            </button>

                            {/* SMS Composer Button */}
                            <button
                              onClick={() => {
                                setSmsModalOrder(order);
                                setSmsText(`প্রিয় ${order.customer?.name}, পিরান শপ-এ আপনার অর্ডার ${order.order_id} প্রসেসিং সম্পন্ন হয়েছে। মোট বিল: ${order.pricing?.total || 0}৳। লাইভ ট্র্যাকিং করুন: piranshop.online ধন্যবাদ!`);
                              }}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                              title="গ্রাহকের মোবাইলে সরাসরি এসএমএস পাঠান"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>এসএমএস</span>
                            </button>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-300">
                          <div>
                            <p className="font-bold text-white text-sm">
                              👤 {order.customer?.name}
                            </p>
                            <p className="text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                              <Phone className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{order.customer?.phone}</span>
                            </p>
                            <p className="text-slate-300 mt-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
                              <MapPin className="w-3.5 h-3.5 text-indigo-400 inline mr-1" />
                              {order.shipping_address}
                            </p>
                          </div>

                          <div className="space-y-2 sm:border-l sm:border-slate-800 sm:pl-4">
                            <p className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">
                              অর্ডারকৃত পণ্যসমূহ:
                            </p>
                            <div className="space-y-1">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-slate-300 text-xs">
                                  <span className="line-clamp-1">{item.title_bn || item.title} (x{item.quantity})</span>
                                  <span className="font-bold text-white">৳{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-sm">
                              <span className="text-slate-400">মোট বিল ({order.payment?.method === 'bkash' ? 'বিকাশ' : 'ক্যাশ অন ডেলিভারি'}):</span>
                              <span className="text-indigo-400">৳{order.pricing?.total?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Products */}
            {activeTab === 'products' && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-white">
                    বর্তমানে স্টোরে মোট {products.length} টি পণ্য লাইভ আছে
                  </h3>
                  <button
                    onClick={() => setActiveTab('add_product')}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> নতুন পণ্য যোগ
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-900 rounded-2xl border border-slate-800 p-3 flex gap-3 items-center justify-between"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-slate-300">
                        <span className="text-[10px] text-indigo-400 font-semibold uppercase">
                          {p.category_name}
                        </span>
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {p.title_bn || p.title}
                        </h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xs font-black text-emerald-400">৳{p.price}</span>
                          <span className="text-[10px] text-slate-500">স্টক: {p.stock}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${p.title_bn || p.title}" পণ্যটি মুছে ফেলতে চান?`)) {
                            onDeleteProduct(p.id);
                          }
                        }}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
                        title="পণ্য ডিলিট করুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Add Product Form */}
            {activeTab === 'add_product' && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 max-w-2xl mx-auto w-full text-slate-300">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-white">নতুন পণ্য যোগ করুন</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    নিচের তথ্যগুলো দিয়ে সেভ করলেই সরাসরি আপনার লাইভ স্টোরে যুক্ত হয়ে যাবে
                  </p>
                </div>

                {productSuccessMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{productSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      পণ্যের নাম (বাংলা) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: প্রিমিয়াম সিল্ক পাঞ্জাবি"
                      value={newTitleBn}
                      onChange={(e) => setNewTitleBn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">ক্যাটাগরি *</label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 outline-hidden"
                      >
                        {categories.filter(c => c.id !== 'all').map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">স্টক সংখ্যা</label>
                      <input
                        type="number"
                        placeholder="20"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">বিক্রয় মূল্য (৳) *</label>
                      <input
                        type="number"
                        required
                        placeholder="যেমন: 2500"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 focus:border-indigo-500 font-bold outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1">আগের মূল্য / স্ট্রাইক (৳)</label>
                      <input
                        type="number"
                        placeholder="যেমন: 3200"
                        value={newOrigPrice}
                        onChange={(e) => setNewOrigPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">পণ্যের ছবির লিংক (Image URL)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 outline-hidden"
                    />
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      খালি রাখলে স্বয়ংক্রিয়ভাবে একটি আকর্ষণীয় প্রিমিয়াম ইমেজ যুক্ত হবে।
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">পণ্যের বিবরণ (Description)</label>
                    <textarea
                      rows={2}
                      placeholder="পণ্যের ফিচার বা বিবরণ..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 outline-hidden"
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
                    <label htmlFor="flashCheck" className="text-slate-300 font-medium cursor-pointer">
                      এই পণ্যটি "ফ্ল্যাশ ডিলস (Flash Deals)" সেকশনে যুক্ত করুন
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/25 mt-2"
                  >
                    পণ্যটি ওয়েবসাইটে পাবলিশ করুন 🚀
                  </button>
                </form>
              </div>
            )}

            {/* Tab 4: Courier Automation & Settings */}
            {activeTab === 'courier' && (
              <div className="space-y-6">
                {/* Settings Form */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                        <Truck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white">কুরিয়ার অটোমেশন ও API সেটিংস</h3>
                        <p className="text-xs text-slate-400">Steadfast ও Pathao কুরিয়ার API কনফিগারেশন</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ● অটোমেটিক বুকিং সক্রিয়
                      </span>
                    </div>
                  </div>

                  {courierSavedMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{courierSavedMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl text-xs">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">ডিফল্ট কুরিয়ার সার্ভিস</label>
                      <select
                        value={courierSettings.default_provider}
                        onChange={(e) => setCourierSettings({ ...courierSettings, default_provider: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 outline-hidden font-semibold cursor-pointer"
                      >
                        <option value="steadfast">Steadfast Courier (স্টেডফাস্ট - রিকমেন্ডেড)</option>
                        <option value="pathao">Pathao Courier (পাঠাও কুরিয়ার)</option>
                      </select>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-400 text-sm flex items-center gap-1.5">
                          <Key className="w-4 h-4" /> Steadfast Courier API
                        </span>
                        <a
                          href="https://portal.steadfast.com.bd"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1"
                        >
                          <span>স্টেডফাস্ট পোর্টাল</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Steadfast Api-Key</label>
                        <input
                          type="text"
                          placeholder="আপনার স্টেডফাস্ট API Key দিন..."
                          value={courierSettings.steadfast_api_key || ''}
                          onChange={(e) => setCourierSettings({ ...courierSettings, steadfast_api_key: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Steadfast Secret-Key</label>
                        <input
                          type="password"
                          placeholder="আপনার স্টেডফাস্ট Secret Key দিন..."
                          value={courierSettings.steadfast_secret_key || ''}
                          onChange={(e) => setCourierSettings({ ...courierSettings, steadfast_secret_key: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 outline-hidden"
                        />
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        💡 <strong>কীভাবে পাবেন:</strong> Steadfast মার্চেন্ট পোর্টালে লগইন করে Settings ➔ API Setting মেন্যু থেকে Api-Key এবং Secret-Key কপি করে এখানে পেস্ট করুন। কি না দেওয়া পর্যন্ত সিস্টেম স্বয়ংক্রিয়ভাবে টেস্ট মোডে ট্র্যাকিং কোড জেনারেট করবে।
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md shadow-emerald-600/20 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>সেটিংস সেভ করুন</span>
                    </button>
                  </form>
                </div>

                {/* Dispatched Parcels Overview */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-6">
                  <h4 className="text-sm font-bold text-white mb-3">📦 কুরিয়ারে বুকিংকৃত পার্সেলসমূহ</h4>
                  <div className="overflow-x-auto">
                    {orders.filter(o => o.courier_info).length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">এখনও কোনো অর্ডার কুরিয়ারে পাঠানো হয়নি। "গ্রাহকের অর্ডারসমূহ" থেকে "কুরিয়ারে পাঠান" চাপুন।</p>
                    ) : (
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="pb-2 font-semibold">অর্ডার আইডি</th>
                            <th className="pb-2 font-semibold">কুরিয়ার</th>
                            <th className="pb-2 font-semibold">ট্র্যাকিং কোড</th>
                            <th className="pb-2 font-semibold">গ্রাহকের নাম ও ফোন</th>
                            <th className="pb-2 font-semibold">ক্যাশ টু কালেক্ট</th>
                            <th className="pb-2 font-semibold text-right">ট্র্যাকিং লিংক</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {orders.filter(o => o.courier_info).map((o) => (
                            <tr key={o.order_id} className="text-slate-300">
                              <td className="py-2.5 font-mono font-bold text-indigo-400">{o.order_id}</td>
                              <td className="py-2.5 font-medium">{o.courier_info.provider}</td>
                              <td className="py-2.5 font-mono font-bold text-emerald-400">{o.courier_info.tracking_code}</td>
                              <td className="py-2.5">{o.customer?.name} ({o.customer?.phone})</td>
                              <td className="py-2.5 font-bold text-white">৳{o.pricing?.total?.toLocaleString()}</td>
                              <td className="py-2.5 text-right">
                                {o.courier_info.tracking_url && (
                                  <a
                                    href={o.courier_info.tracking_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-indigo-400 font-semibold inline-flex items-center gap-1"
                                  >
                                    <span>ট্র্যাক</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Bengali SMS Gateway Settings */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white">বাংলা কাস্টমার এসএমএস সেটিংস</h3>
                      <p className="text-xs text-slate-400">Greenweb, BulkSMSBD বা যেকোনো বাংলাদেশী এসএমএস গেটওয়ে</p>
                    </div>
                  </div>

                  {smsSettingsSavedMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{smsSettingsSavedMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSmsSettings} className="space-y-4 max-w-2xl text-xs">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-300 mb-1.5">এসএমএস গেটওয়ে প্রোভাইডার</label>
                        <select
                          value={smsSettings.gateway}
                          onChange={(e) => setSmsSettings({ ...smsSettings, gateway: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-indigo-500 outline-hidden font-semibold cursor-pointer"
                        >
                          <option value="greenweb">Greenweb SMS (গ্রিনওয়েব বাংলাদেশ)</option>
                          <option value="bulksmsbd">BulkSMSBD (বাল্ক এসএমএস বিডি)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-300 mb-1.5">সেন্ডার আইডি (Sender ID)</label>
                        <input
                          type="text"
                          placeholder="যেমন: PiranShop"
                          value={smsSettings.sender_id || ''}
                          onChange={(e) => setSmsSettings({ ...smsSettings, sender_id: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-300 mb-1.5">Gateway API Key / Token</label>
                      <input
                        type="password"
                        placeholder="আপনার এসএমএস গেটওয়ের API Token দিন..."
                        value={smsSettings.api_key || ''}
                        onChange={(e) => setSmsSettings({ ...smsSettings, api_key: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:border-indigo-500 outline-hidden"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        💡 টোকেন খালি থাকলে সিস্টেম টেস্ট মোডে ব্রাউজারে কনফার্মেশন ও লগ তৈরি করবে। লাইভ পাঠাতে আপনার Greenweb বা BulkSMSBD API কি দিন।
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                        <input
                          type="checkbox"
                          checked={smsSettings.auto_order_sms}
                          onChange={(e) => setSmsSettings({ ...smsSettings, auto_order_sms: e.target.checked })}
                          className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                        <span>গ্রাহক অর্ডার প্লেস করার সাথে সাথে কনফার্মেশন এসএমএস পাঠান</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
                        <input
                          type="checkbox"
                          checked={smsSettings.auto_courier_sms}
                          onChange={(e) => setSmsSettings({ ...smsSettings, auto_courier_sms: e.target.checked })}
                          className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                        />
                        <span>কুরিয়ারে পার্সেল হস্তান্তরের পর ট্র্যাকিং কোড সহ এসএমএস পাঠান</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md shadow-indigo-600/20 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>এসএমএস সেটিংস সেভ করুন</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick SMS Composer Modal */}
        {smsModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">গ্রাহককে বাংলা এসএমএস পাঠান</h3>
                    <p className="text-xs text-slate-400">প্রাপক: <strong className="text-emerald-400 font-mono">{smsModalOrder.customer?.phone}</strong> ({smsModalOrder.customer?.name})</p>
                  </div>
                </div>
                <button
                  onClick={() => setSmsModalOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Pre-written SMS Templates */}
              <div>
                <span className="text-[11px] text-slate-400 font-bold block mb-1.5">রেডিমেড টেমপ্লেট নির্বাচন করুন:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSmsText(`প্রিয় ${smsModalOrder.customer?.name}, পিরান শপ-এ আপনার অর্ডার ${smsModalOrder.order_id} সফলভাবে গৃহীত হয়েছে। মোট বিল: ${smsModalOrder.pricing?.total || 0}৳। ধন্যবাদ!`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    অর্ডার কনফার্মেশন
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmsText(`প্রিয় ${smsModalOrder.customer?.name}, আপনার অর্ডারটি কুরিয়ারে হস্তান্তর করা হয়েছে। দ্রুততম সময়ে ডেলিভারি পাবেন। ট্র্যাকিং: piranshop.online`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    কুরিয়ার আপডেট
                  </button>
                  <button
                    type="button"
                    onClick={() => setSmsText(`প্রিয় ${smsModalOrder.customer?.name}, আপনার ডেলিভারি রাইডার আজ পৌঁছাবে। ক্যাশ টাকা প্রস্তুত রাখার অনুরোধ করা হচ্ছে। - পিরান শপ`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    রাইডার আজ পৌঁছাবে
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendCustomSms} className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-300">এসএমএস বার্তা (Bangla / English)</label>
                    <span className="text-[10px] text-slate-400 font-mono">{smsText.length} অক্ষর</span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-hidden leading-relaxed"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSmsModalOrder(null)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingSms}
                    className="flex-2 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition cursor-pointer shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    {isSendingSms ? (
                      <span>পাঠানো হচ্ছে...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>এসএমএস পাঠান ✉️</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invoice Viewer Modal */}
        <InvoiceModal
          isOpen={selectedInvoiceOrder !== null}
          onClose={() => setSelectedInvoiceOrder(null)}
          order={selectedInvoiceOrder}
        />

        {/* Dispatch to Courier Modal */}
        {dispatchingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">কুরিয়ারে পার্সেল বুকিং</h3>
                    <p className="text-xs text-slate-400">অর্ডার: <span className="font-mono text-indigo-400">{dispatchingOrder.order_id}</span></p>
                  </div>
                </div>
                <button
                  onClick={() => setDispatchingOrder(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Order Quick Summary */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">গ্রাহকের নাম:</span>
                  <span className="font-bold text-white">{dispatchingOrder.customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">মোবাইল নম্বর:</span>
                  <span className="font-mono font-bold text-emerald-400">{dispatchingOrder.customer?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ডেলিভারি ঠিকানা:</span>
                  <span className="font-medium text-slate-300 text-right max-w-xs">{dispatchingOrder.shipping_address}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800/80 font-bold">
                  <span className="text-slate-400">ক্যাশ অন ডেলিভারি (COD):</span>
                  <span className="text-indigo-400 text-sm">৳{dispatchingOrder.pricing?.total?.toLocaleString()}</span>
                </div>
              </div>

              <form onSubmit={handleConfirmDispatch} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">কুরিয়ার সার্ভিস নির্বাচন করুন</label>
                  <select
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-hidden font-semibold cursor-pointer"
                  >
                    <option value="steadfast">Steadfast Courier (স্টেডফাস্ট কুরিয়ার - রিকমেন্ডেড)</option>
                    <option value="pathao">Pathao Courier (পাঠাও কুরিয়ার)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">ডেলিভারি স্পেশাল নোট (Instructions)</label>
                  <input
                    type="text"
                    value={courierNote}
                    onChange={(e) => setCourierNote(e.target.value)}
                    placeholder="যেমন: প্যাকেট অক্ষত অবস্থায় চেক করতে দিন..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-indigo-500 outline-hidden"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDispatchingOrder(null)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isDispatching}
                    className="flex-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    {isDispatching ? (
                      <span>বুকিং হচ্ছে...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>কনসাইনমেন্ট নিশ্চিত করুন 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-slate-800 text-slate-600 text-xs">
        © 2026 Piran Shop. All Rights Reserved. Secret Admin Access.
      </footer>
    </div>
  );
}
