// Vercel Serverless Function: /api/categories
const categories = [
  { id: 'all', name: 'সব পণ্য', name_en: 'All Products', icon: 'Sparkles', count: 28 },
  { id: 'gadgets', name: 'স্মার্ট গ্যাজেট', name_en: 'Gadgets', icon: 'Smartphone', count: 6 },
  { id: 'fashion', name: 'ফ্যাশন ও লাইফস্টাইল', name_en: 'Fashion', icon: 'Shirt', count: 5 },
  { id: 'home', name: 'হোম ও কিচেন', name_en: 'Home & Kitchen', icon: 'Home', count: 4 },
  { id: 'groceries', name: 'নিত্যপ্রয়োজনীয় গ্রোসারি', name_en: 'Groceries', icon: 'ShoppingBag', count: 4 },
  { id: 'beauty', name: 'সৌন্দর্য ও রূপচর্চা', name_en: 'Beauty & Care', icon: 'Sparkles', count: 4 },
  { id: 'it', name: 'কম্পিউটার ও আইটি', name_en: 'Computers & IT', icon: 'Laptop', count: 3 },
  { id: 'sports', name: 'ফিটনেস ও স্পোর্টস', name_en: 'Sports & Fitness', icon: 'Activity', count: 2 }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({ success: true, data: categories });
};
