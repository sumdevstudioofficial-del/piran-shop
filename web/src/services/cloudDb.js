// Central Cloud Database & Real-time Persistence Service for Piran Shop (পিরান শপ)
// Connects Web Storefront, Checkout, Tracking, and Admin Dashboard to live cloud storage.

import bundledProducts from '../data/products.json';
import bundledCategories from '../data/categories.json';

const ORDERS_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/fedbfff';
const PRODUCTS_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/efdbfad';

// Helper to safely parse JSON
function safeParse(str, fallback) {
  try {
    return JSON.parse(str) || fallback;
  } catch {
    return fallback;
  }
}

// 1. Fetch Orders from Cloud (with multiple fallbacks)
export async function getOrders() {
  // Try 1: Call Vercel serverless /api/orders
  try {
    const res = await fetch('/api/orders', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        localStorage.setItem('piran_orders', JSON.stringify(data.orders));
        return data.orders;
      }
    }
  } catch (e) {
    // API function not yet ready, continue to Cloud Bin
  }

  // Try 2: Fetch directly from Cloud Bin
  try {
    const res = await fetch(ORDERS_BIN_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const orders = data.orders || [];
      if (Array.isArray(orders) && orders.length > 0) {
        localStorage.setItem('piran_orders', JSON.stringify(orders));
        return orders;
      }
    }
  } catch (e) {
    console.warn('[CloudDb] Failed to fetch orders from cloud bin:', e);
  }

  // Try 3: Fallback to LocalStorage
  const local = safeParse(localStorage.getItem('piran_orders'), []);
  return local;
}

// 2. Create Order in Cloud Database
export async function createOrder(orderPayload) {
  const { customer, shipping_address, address_details, items, payment_method } = orderPayload;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const isDhaka = address_details?.district === 'ঢাকা' || shipping_address?.includes('ঢাকা');
  let deliveryFee = 0;
  if (subtotal < 1500) {
    deliveryFee = isDhaka ? 60 : 120;
  }
  const total = subtotal + deliveryFee;

  const orderId = 'PIRAN-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    order_id: orderId,
    customer,
    shipping_address,
    address_details: address_details || null,
    items,
    pricing: {
      subtotal,
      delivery_fee: deliveryFee,
      total
    },
    payment: {
      method: payment_method || 'cod',
      status: payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'
    },
    status: 'Processing',
    status_bn: 'প্রক্রিয়াধীন রয়েছে',
    estimated_delivery: isDhaka ? '২৪-৪৮ ঘণ্টার মধ্যে' : '২-৩ কার্যদিবসের মধ্যে',
    created_at: new Date().toISOString()
  };

  // Step A: Save to local storage immediately for zero-latency UI
  try {
    const local = safeParse(localStorage.getItem('piran_orders'), []);
    const updatedLocal = [newOrder, ...local];
    localStorage.setItem('piran_orders', JSON.stringify(updatedLocal));
  } catch (e) {}

  // Step B: Post to /api/orders
  let apiSucceeded = false;
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        apiSucceeded = true;
      }
    }
  } catch (e) {}

  // Step C: Also update Cloud Storage Bin directly to guarantee persistence
  try {
    // Read current orders from bin
    const currentRes = await fetch(ORDERS_BIN_URL, { cache: 'no-store' });
    let existingOrders = [];
    if (currentRes.ok) {
      const curData = await currentRes.json();
      existingOrders = curData.orders || [];
    }
    // Prepend new order if not already present
    if (!existingOrders.some(o => o.order_id === orderId)) {
      const updatedOrders = [newOrder, ...existingOrders];
      await fetch(ORDERS_BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: updatedOrders })
      });
    }
  } catch (e) {
    console.warn('[CloudDb] Direct cloud bin write fallback failed:', e);
  }

  return newOrder;
}

// 3. Update Order Status in Cloud
export async function updateOrderStatus(orderId, newStatus, newStatusBn) {
  // Update local
  try {
    const local = safeParse(localStorage.getItem('piran_orders'), []);
    const updatedLocal = local.map(o =>
      o.order_id === orderId ? { ...o, status: newStatus, status_bn: newStatusBn } : o
    );
    localStorage.setItem('piran_orders', JSON.stringify(updatedLocal));
  } catch (e) {}

  // Update Cloud Bin
  try {
    const curRes = await fetch(ORDERS_BIN_URL, { cache: 'no-store' });
    if (curRes.ok) {
      const curData = await curRes.json();
      const orders = curData.orders || [];
      const updated = orders.map(o =>
        o.order_id === orderId ? { ...o, status: newStatus, status_bn: newStatusBn } : o
      );
      await fetch(ORDERS_BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: updated })
      });
      return true;
    }
  } catch (e) {
    console.warn('[CloudDb] Failed to update status in cloud bin:', e);
  }

  // Also try API PATCH
  try {
    await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, status: newStatus, status_bn: newStatusBn })
    });
  } catch (e) {}

  return true;
}

// 4. Fetch Products (Bundled + Cloud Custom Products)
export async function getProducts() {
  let customProds = [];

  // Try cloud bin
  try {
    const res = await fetch(PRODUCTS_BIN_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.custom_products)) {
        customProds = data.custom_products;
        localStorage.setItem('piran_custom_products', JSON.stringify(customProds));
      }
    }
  } catch (e) {
    // Try localStorage
    customProds = safeParse(localStorage.getItem('piran_custom_products'), []);
  }

  // Merge custom products on top of bundled products
  const customIds = new Set(customProds.map(p => p.id));
  const baseRemaining = bundledProducts.filter(p => !customIds.has(p.id));
  return [...customProds, ...baseRemaining];
}

// 5. Add Custom Product to Cloud
export async function addCustomProduct(newProd) {
  // Update local
  try {
    const local = safeParse(localStorage.getItem('piran_custom_products'), []);
    const updatedLocal = [newProd, ...local.filter(p => p.id !== newProd.id)];
    localStorage.setItem('piran_custom_products', JSON.stringify(updatedLocal));
  } catch (e) {}

  // Update Cloud Bin
  try {
    const curRes = await fetch(PRODUCTS_BIN_URL, { cache: 'no-store' });
    let existing = [];
    if (curRes.ok) {
      const curData = await curRes.json();
      existing = curData.custom_products || [];
    }
    const updated = [newProd, ...existing.filter(p => p.id !== newProd.id)];
    await fetch(PRODUCTS_BIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ custom_products: updated })
    });
  } catch (e) {
    console.warn('[CloudDb] Failed to add custom product to cloud bin:', e);
  }

  return newProd;
}

// 6. Delete Custom Product from Cloud
export async function deleteCustomProduct(productId) {
  // Update local
  try {
    const local = safeParse(localStorage.getItem('piran_custom_products'), []);
    const updatedLocal = local.filter(p => p.id !== productId);
    localStorage.setItem('piran_custom_products', JSON.stringify(updatedLocal));
  } catch (e) {}

  // Update Cloud Bin
  try {
    const curRes = await fetch(PRODUCTS_BIN_URL, { cache: 'no-store' });
    if (curRes.ok) {
      const curData = await curRes.json();
      const existing = curData.custom_products || [];
      const updated = existing.filter(p => p.id !== productId);
      await fetch(PRODUCTS_BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_products: updated })
      });
    }
  } catch (e) {
    console.warn('[CloudDb] Failed to delete product from cloud bin:', e);
  }

  return true;
}

// 7. Track Order by ID (Searches cloud database)
export async function trackOrder(orderId) {
  if (!orderId) return null;
  const cleanId = orderId.trim().toUpperCase();

  // Try cloud orders
  try {
    const res = await fetch(ORDERS_BIN_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const orders = data.orders || [];
      const found = orders.find(o => o.order_id?.toUpperCase() === cleanId);
      if (found) return found;
    }
  } catch (e) {}

  // Try local orders
  const local = safeParse(localStorage.getItem('piran_orders'), []);
  const foundLocal = local.find(o => o.order_id?.toUpperCase() === cleanId);
  return foundLocal || null;
}

// 8. Ping Cloud Database health
export async function checkCloudHealth() {
  const startTime = Date.now();
  try {
    const res = await fetch(ORDERS_BIN_URL, { cache: 'no-store', method: 'GET' });
    const latency = Date.now() - startTime;
    return {
      connected: res.ok,
      latencyMs: latency,
      provider: 'ExtendsClass Cloud DB'
    };
  } catch (e) {
    return {
      connected: false,
      latencyMs: 0,
      provider: 'Offline / LocalStorage'
    };
  }
}
