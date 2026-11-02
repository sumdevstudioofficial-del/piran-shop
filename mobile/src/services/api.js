// Mobile API configuration
// When testing on real Android/iOS device via Expo, replace localhost with your PC's IP address (e.g. 192.168.0.221)
export const API_BASE_URL = 'http://192.168.0.221:5000/api';

export async function fetchProducts(category = 'all', query = '') {
  try {
    const res = await fetch(`${API_BASE_URL}/products?category=${category}&q=${query}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Fetch products error:', error);
    return [];
  }
}

export async function fetchFlashDeals() {
  try {
    const res = await fetch(`${API_BASE_URL}/deals`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Fetch deals error:', error);
    return [];
  }
}

export async function createOrder(orderPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    return await res.json();
  } catch (error) {
    console.error('Create order error:', error);
    return { success: false, message: 'অর্ডার করতে নেটওয়ার্ক সমস্যা হয়েছে।' };
  }
}

export async function trackOrder(orderId) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    return await res.json();
  } catch (error) {
    console.error('Track order error:', error);
    return { success: false, message: 'অর্ডার ট্র্যাকিং এ সমস্যা হয়েছে।' };
  }
}
