const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
  }

  // If already connected, no-op.
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  // If a connection is already in-flight (serverless warm starts), await it.
  if (connectionPromise) {
    await connectionPromise;
    return mongoose.connection;
  }

  // Establish connection (cache promise so concurrent requests share it).
  connectionPromise = mongoose
    .connect(process.env.MONGO_URI, {
      // Fail fast if Atlas/network/env is misconfigured
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 10000
    })
    .then(() => {
      console.log('MongoDB connected');
      return mongoose.connection;
    })
    .catch((err) => {
      // Reset cached promise so next attempt can retry
      connectionPromise = null;
      throw err;
    });

  await connectionPromise;
  return mongoose.connection;
};

module.exports = connectDB;