/* Vercel Serverless Function entrypoint (catch-all).
   Routes all /api/* requests into the existing Express app.
*/

const path = require('path');

// Load local env for development runs (Vercel provides env vars in production).
try {
  if (process.env.NODE_ENV !== 'production') {
    // Prefer backend/.env if present; ignore if missing.
    // eslint-disable-next-line global-require
    require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });
  }
} catch (e) {
  // ignore
}

const app = require('../backend/app');
const connectDB = require('../backend/config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error('Vercel handler error:', err);
    return res.status(500).json({ success: false, message: 'Server initialization failed' });
  }
};
