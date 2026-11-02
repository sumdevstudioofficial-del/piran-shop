// Vercel Serverless Function: /api/stats
const ORDERS_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/fedbfff';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch(ORDERS_BIN_URL, { cache: 'no-store' });
    let orders = [];
    if (response.ok) {
      const data = await response.json();
      orders = data.orders || [];
    }

    const totalRevenue = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'Processing' || o.status === 'Placed').length;

    return res.status(200).json({
      success: true,
      stats: {
        total_products: 28,
        total_orders: orders.length,
        pending_orders: pendingOrders,
        total_revenue: totalRevenue,
        categories_count: 8,
        customer_satisfaction: '99.4%'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
