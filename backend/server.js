const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const productsFilePath = path.join(__dirname, 'data', 'products.json');
const categoriesFilePath = path.join(__dirname, 'data', 'categories.json');
const ordersFilePath = path.join(__dirname, 'data', 'orders.json');

// Helper to read JSON
function readJson(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

// Helper to write JSON
function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Initial check for orders file
if (!fs.existsSync(ordersFilePath)) {
  writeJson(ordersFilePath, []);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    store: 'Piran Shop API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// GET Categories
app.get('/api/categories', (req, res) => {
  const categories = readJson(categoriesFilePath, []);
  res.json({ success: true, data: categories });
});

// GET Products (with search, category filter, sorting)
app.get('/api/products', (req, res) => {
  const { category, q, sort, flash_only } = req.query;
  let products = readJson(productsFilePath, []);

  // Filter by category
  if (category && category !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  // Filter by search query
  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    products = products.filter(p => 
      p.title.toLowerCase().includes(query) ||
      (p.title_bn && p.title_bn.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      p.category_name.toLowerCase().includes(query)
    );
  }

  // Filter flash sales
  if (flash_only === 'true') {
    products = products.filter(p => p.is_flash_deal);
  }

  // Sorting
  if (sort === 'price_asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'reviews') {
    products.sort((a, b) => b.reviews_count - a.reviews_count);
  }

  res.json({
    success: true,
    total: products.length,
    data: products
  });
});

// GET Single Product
app.get('/api/products/:id', (req, res) => {
  const products = readJson(productsFilePath, []);
  const product = products.find(p => p.id === req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'পণ্যটি পাওয়া যায়নি।' });
  }

  res.json({ success: true, data: product });
});

// GET Flash Deals
app.get('/api/deals', (req, res) => {
  const products = readJson(productsFilePath, []);
  const flashDeals = products.filter(p => p.is_flash_deal);

  res.json({
    success: true,
    data: flashDeals,
    countdown: {
      hours: 14,
      minutes: 25,
      seconds: 40
    }
  });
});

// POST Create Order
app.post('/api/orders', (req, res) => {
  const { customer, items, payment_method, shipping_address, address_details } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'কার্ট খালি, কোনো পণ্য নেই।' });
  }

  if (!customer || !customer.phone || !customer.name) {
    return res.status(400).json({ success: false, message: 'গ্রাহকের নাম ও মোবাইল নম্বর আবশ্যক।' });
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Free delivery over 1500 BDT; Dhaka 60 BDT; Outside Dhaka 120 BDT
  let deliveryFee = 0;
  const isDhaka = (address_details?.district === 'ঢাকা') || (shipping_address && shipping_address.includes('ঢাকা'));
  if (subtotal < 1500) {
    deliveryFee = isDhaka ? 60 : 120;
  }
  const total = subtotal + deliveryFee;

  const orderId = 'PIRAN-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    order_id: orderId,
    customer,
    items,
    pricing: {
      subtotal,
      delivery_fee: deliveryFee,
      total
    },
    payment: {
      method: payment_method || 'cod', // bKash, nagad, card, cod
      status: payment_method === 'cod' ? 'Cash on Delivery' : 'Paid Online'
    },
    shipping_address,
    address_details: address_details || null,
    status: 'Processing', // Placed, Processing, Shipped, Delivered
    status_bn: 'প্রক্রিয়াধীন রয়েছে',
    estimated_delivery: isDhaka ? '২৪-৪৮ ঘণ্টার মধ্যে' : '২-৩ কার্যদিবসের মধ্যে',
    created_at: new Date().toISOString()
  };

  const orders = readJson(ordersFilePath, []);
  orders.unshift(newOrder);
  writeJson(ordersFilePath, orders);

  res.status(201).json({
    success: true,
    message: 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!',
    order: newOrder
  });
});

// GET Track Order
app.get('/api/orders/:orderId', (req, res) => {
  const orders = readJson(ordersFilePath, []);
  const order = orders.find(o => o.order_id.toLowerCase() === req.params.orderId.toLowerCase());

  if (!order) {
    return res.status(404).json({ success: false, message: 'অর্ডার আইডি পাওয়া যায়নি।' });
  }

  res.json({ success: true, data: order });
});

// GET Store Stats
app.get('/api/stats', (req, res) => {
  const products = readJson(productsFilePath, []);
  const orders = readJson(ordersFilePath, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

  res.json({
    success: true,
    stats: {
      total_products: products.length,
      total_orders: orders.length,
      total_revenue: totalRevenue,
      categories_count: 7,
      customer_satisfaction: '99.4%'
    }
  });
});

app.listen(PORT, () => {
  console.log(`[Piran Shop Server] Running on http://localhost:${PORT}`);
});
