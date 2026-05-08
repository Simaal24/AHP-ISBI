const { MongoClient, ServerApiVersion } = require('mongodb');

let client;
let db;

module.exports = async function connectDB() {
  if (db) return db;
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }
  await client.connect();
  db = client.db('isbi_ahp');
  return db;
};
