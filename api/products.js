// Vercel Serverless Function: /api/products
// Manages products with cloud persistence for Piran Shop

const PRODUCTS_BIN_URL = 'https://extendsclass.com/api/json-storage/bin/efdbfad';

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

  // GET: Fetch custom products
  if (req.method === 'GET') {
    try {
      const response = await fetch(PRODUCTS_BIN_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error('Cloud DB read error');
      const data = await response.json();
      return res.status(200).json({
        success: true,
        custom_products: data.custom_products || []
      });
    } catch (error) {
      console.error('[API /products GET error]:', error);
      return res.status(200).json({ success: true, custom_products: [] });
    }
  }

  // POST: Add custom product
  if (req.method === 'POST') {
    try {
      const product = req.body;
      if (!product || !product.title_bn) {
        return res.status(400).json({ success: false, message: 'পণ্যের তথ্য সঠিক নয়।' });
      }

      const response = await fetch(PRODUCTS_BIN_URL, { cache: 'no-store' });
      let existing = [];
      if (response.ok) {
        const data = await response.json();
        existing = data.custom_products || [];
      }

      const updated = [product, ...existing.filter((p) => p.id !== product.id)];

      await fetch(PRODUCTS_BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_products: updated })
      });

      return res.status(201).json({
        success: true,
        message: 'পণ্য সফলভাবে ক্লাউড ডেটাবেজে সংরক্ষিত হয়েছে!',
        product
      });
    } catch (error) {
      console.error('[API /products POST error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // DELETE: Delete custom product
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Product ID required' });
      }

      const response = await fetch(PRODUCTS_BIN_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not read Cloud DB');

      const data = await response.json();
      const existing = data.custom_products || [];
      const updated = existing.filter((p) => p.id !== id);

      await fetch(PRODUCTS_BIN_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ custom_products: updated })
      });

      return res.status(200).json({
        success: true,
        message: 'পণ্য সফলভাবে ক্লাউড ডেটাবেজ থেকে মুছে ফেলা হয়েছে।'
      });
    } catch (error) {
      console.error('[API /products DELETE error]:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
};
