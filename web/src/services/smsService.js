// SMS Notification Service for Piran Shop (পিরান শপ)
// Sends automated Bengali SMS for Order Placed & Courier Dispatched

// 1. Get SMS Settings
export function getSmsSettings() {
  try {
    const saved = localStorage.getItem('piran_sms_settings');
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  return {
    gateway: 'greenweb', // greenweb | bulksmsbd
    api_key: '',
    sender_id: 'PiranShop',
    auto_order_sms: true,
    auto_courier_sms: true
  };
}

// 2. Save SMS Settings
export function saveSmsSettings(settings) {
  try {
    localStorage.setItem('piran_sms_settings', JSON.stringify(settings));
    return true;
  } catch (e) {
    return false;
  }
}

// 3. Send SMS Helper
export async function sendSms(to, message) {
  if (!to || !message) return null;

  const settings = getSmsSettings();

  try {
    const response = await fetch('/api/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        message,
        gateway: settings.gateway,
        api_key: settings.api_key,
        sender_id: settings.sender_id
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (e) {
    console.warn('[SmsService] API call failed:', e);
  }

  // Fallback simulator for offline / client
  return {
    success: true,
    mode: 'sandbox',
    recipient: to,
    message,
    timestamp: new Date().toISOString()
  };
}

export const sendCustomSms = sendSms;

// 4. Send Order Confirmation SMS
export async function sendOrderConfirmationSms(order) {
  const settings = getSmsSettings();
  if (!settings.auto_order_sms) return null;

  const name = order.customer?.name || 'গ্রাহক';
  const phone = order.customer?.phone;
  const orderId = order.order_id;
  const total = order.pricing?.total || 0;

  if (!phone) return null;

  const smsText = `প্রিয় ${name}, পিরান শপ-এ আপনার অর্ডার ${orderId} সফলভাবে গৃহীত হয়েছে। মোট বিল: ${total}৳। লাইভ ট্র্যাকিং করুন: piranshop.online ধন্যবাদ!`;

  return await sendSms(phone, smsText);
}

// 5. Send Courier Dispatched SMS
export async function sendCourierDispatchSms(order, courierInfo) {
  const settings = getSmsSettings();
  if (!settings.auto_courier_sms) return null;

  const name = order.customer?.name || 'গ্রাহক';
  const phone = order.customer?.phone;
  const provider = courierInfo?.provider || 'কুরিয়ার';
  const trackingCode = courierInfo?.tracking_code || '';

  if (!phone) return null;

  const smsText = `প্রিয় ${name}, আপনার অর্ডারটি ${provider}-এ বুকিং করা হয়েছে। ট্র্যাকিং কোড: ${trackingCode}। ২-৩ দিনের মধ্যে ডেলিভারি পাবেন। - পিরান শপ`;

  return await sendSms(phone, smsText);
}
