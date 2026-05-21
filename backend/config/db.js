const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  // Serverless-friendly connection caching:
  // Vercel may invoke the function many times; reusing the connection
  // drastically reduces latency and avoids exhausting DB connection limits.
  const globalCache = global.__mongooseCache || (global.__mongooseCache = { conn: null, promise: null });

  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(process.env.MONGO_URI).then((m) => m);
  }

  globalCache.conn = await globalCache.promise;
  if (process.env.NODE_ENV !== 'production') console.log('MongoDB connected');
  return globalCache.conn;
};

module.exports = connectDB;