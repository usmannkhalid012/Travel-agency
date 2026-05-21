/* Vercel Serverless Function entrypoint (catch-all) for backend-only deployment.
   Place this file under backend/api/ and deploy the backend folder as a Vercel project.
*/

const path = require('path');

// Load local env for development runs (Vercel provides env vars in production).
try {
  if (process.env.NODE_ENV !== 'production') {
    // Prefer backend/.env if present; ignore if missing.
    // eslint-disable-next-line global-require
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
  }
} catch (e) {
  // ignore
}

const app = require('../app');
const connectDB = require('../config/db');

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error('Vercel handler error:', err);
    return res.status(500).json({ success: false, message: 'Server initialization failed' });
  }
};
