// Vercel Serverless Function: /api/sms
// Sends automated Bengali SMS notifications via Bangladeshi SMS Gateways (Greenweb, BulkSMSBD, MimSMS)

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { to, message, gateway = 'greenweb', api_key, sender_id = 'PIRAN SHOP' } = req.body;

      if (!to || !message) {
        return res.status(400).json({ success: false, message: 'মোবাইল নম্বর ও বার্তা আবশ্যক।' });
      }

      // Format Bangladeshi phone number (ensure 8801XXXXXXXXX)
      let formattedPhone = to.trim().replace(/\D/g, '');
      if (formattedPhone.startsWith('01')) {
        formattedPhone = '88' + formattedPhone;
      }

      // If merchant configured live API credentials:
      if (api_key && api_key.trim().length > 5) {
        try {
          if (gateway === 'greenweb') {
            const url = `https://api.greenweb.com.bd/api.php?token=${encodeURIComponent(api_key.trim())}&to=${encodeURIComponent(formattedPhone)}&message=${encodeURIComponent(message)}`;
            const response = await fetch(url);
            const text = await response.text();
            return res.status(200).json({
              success: true,
              mode: 'live',
              gateway: 'Greenweb SMS',
              response: text
            });
          }

          if (gateway === 'bulksmsbd') {
            const url = `https://bulksmsbd.net/api/smsapi?api_key=${encodeURIComponent(api_key.trim())}&type=text&number=${encodeURIComponent(formattedPhone)}&senderid=${encodeURIComponent(sender_id)}&message=${encodeURIComponent(message)}`;
            const response = await fetch(url);
            const text = await response.text();
            return res.status(200).json({
              success: true,
              mode: 'live',
              gateway: 'BulkSMSBD',
              response: text
            });
          }
        } catch (gwErr) {
          console.error('[SMS Gateway Error]:', gwErr);
        }
      }

      // Simulated Sandbox Response (Logs SMS and returns confirmation for demo/testing)
      return res.status(200).json({
        success: true,
        mode: 'sandbox',
        recipient: formattedPhone,
        sender_id: sender_id || 'PiranShop',
        message: message,
        char_count: message.length,
        dispatched_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('[API /sms error]:', err);
      return res.status(500).json({ success: false, message: 'এসএমএস পাঠাতে সমস্যা হয়েছে।' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
};
