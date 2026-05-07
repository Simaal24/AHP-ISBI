require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  await client.connect();
  db = client.db('isbi_ahp');
  console.log('Connected to MongoDB');
}

app.post('/api/response', async (req, res) => {
  try {
    const payload = {
      ...req.body,
      receivedAt: new Date(),
    };
    const result = await db.collection('responses').insertOne(payload);
    res.json({ ok: true, id: result.insertedId });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/responses', async (req, res) => {
  try {
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
});

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.use(express.static(path.join(__dirname, '..', 'public')));

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(err => { console.error('DB connection failed:', err); process.exit(1); });
