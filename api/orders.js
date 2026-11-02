// Vercel Serverless Function: /api/orders
// Provides persistent cloud database for Piran Shop orders

const ORDERS_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/fedbfff';

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch orders from Cloud DB
  if (req.method === 'GET') {
    try {
      const response = await fetch(ORDERS_BIN_URL, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Cloud DB responded with status ${response.status}`);
      }
      const data = await response.json();
      return res.status(200).json({
        success: true,
        orders: data.orders || []
      });
    } catch (error) {
      console.error('[API /orders GET error]:', error);
      return res.status(500).json({
        success: false,
        message: 'ক্লাউড ডেটাবেজ থেকে অর্ডার লোড করা যায়নি।',
        error: error.message
      });
    }
  }

  // POST: Create new order in Cloud DB
  if (req.method === 'POST') {
    try {
      const order = req.body;
      if (!order || (!order.customer && !order.items)) {
        return res.status(400).json({ success: false, message: 'অর্ডার তথ্য অসম্পূর্ণ।' });
      }

      // Fetch existing orders
      const response = await fetch(ORDERS_BIN_URL, { cache: 'no-store' });
      let existingOrders = [];
      if (response.ok) {
        const data = await response.json();
        existingOrders = data.orders || [];
      }

      // Ensure unique order_id
      const finalOrder = {
        ...order,
        order_id: order.order_id || 'PIRAN-' + Math.floor(100000 + Math.random() * 900000),
        created_at: order.created_at || new Date().toISOString()
      };

      const updatedOrders = [finalOrder, ...existingOrders];

      // Save to Cloud DB
      await fetch(ORDERS_BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: updatedOrders })
      });

      return res.status(201).json({
        success: true,
        message: 'অর্ডার সফলভাবে ক্লাউড ডেটাবেজে সংরক্ষিত হয়েছে!',
        order: finalOrder
      });
    } catch (error) {
      console.error('[API /orders POST error]:', error);
      return res.status(500).json({
        success: false,
        message: 'ক্লাউড ডেটাবেজে অর্ডার সংরক্ষণ ব্যর্থ হয়েছে।',
        error: error.message
      });
    }
  }

  // PATCH: Update order status & courier dispatch info
  if (req.method === 'PATCH' || req.method === 'PUT') {
    try {
      const { order_id, status, status_bn, courier_info } = req.body;
      if (!order_id) {
        return res.status(400).json({ success: false, message: 'Order ID is required' });
      }

      const response = await fetch(ORDERS_BIN_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not read Cloud DB');

      const data = await response.json();
      const orders = data.orders || [];
      const updated = orders.map((o) => {
        if (o.order_id === order_id) {
          const mod = { ...o };
          if (status) {
            mod.status = status;
            mod.status_bn = status_bn || status;
          }
          if (courier_info) {
            mod.courier_info = courier_info;
          }
          return mod;
        }
        return o;
      });

      await fetch(ORDERS_BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: updated })
      });

      return res.status(200).json({
        success: true,
        message: 'অর্ডার এবং কুরিয়ার তথ্য সফলভাবে আপডেট হয়েছে!'
      });
    } catch (error) {
      console.error('[API /orders PATCH error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
};
