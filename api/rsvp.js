module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { name, guests, attendance, message, phone } = req.body;
    if (!name || !attendance) return res.status(400).json({ error: 'Name and attendance required' });
    const entry = { id: Date.now().toString(36) + Math.random().toString(36).substr(2), name: name.trim(), guests: parseInt(guests) || 1, attendance, message: message?.trim() || '', phone: phone?.trim() || '', submittedAt: new Date().toISOString(), ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown' };
    console.log('RSVP:', entry);
    return res.status(200).json({ success: true, message: 'تم التأكيد!', data: entry });
  } catch (error) { console.error('Error:', error); return res.status(500).json({ error: 'Server error', details: error.message }); }
};