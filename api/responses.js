const connectDB = require('./_db');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const db = await connectDB();
    const docs = await db.collection('responses')
      .find({}, { projection: { 'respondent.name': 1, 'respondent.email': 1,
        consistencyRatio: 1, receivedAt: 1 } })
      .sort({ receivedAt: -1 })
      .limit(200)
      .toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
