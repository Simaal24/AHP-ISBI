const connectDB = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const db = await connectDB();
    const payload = { ...req.body, receivedAt: new Date() };
    const result = await db.collection('responses').insertOne(payload);
    res.json({ ok: true, id: result.insertedId });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};
