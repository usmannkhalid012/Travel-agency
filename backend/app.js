const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const busRoutes = require('./routes/busRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const debugRoutes = require('./routes/debugRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Vercel/other platforms sit behind a reverse proxy.
// This makes req.ip and req.protocol respect X-Forwarded-* headers.
app.set('trust proxy', 1);

const path = require('path');

const vercelOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

// Support multiple origins when frontend/backend run on different URLs.
// Example: CORS_ORIGINS="https://app.vercel.app,https://admin.example.com"
const parseOrigins = (value) => (value || '')
  .split(/[,\s]+/)
  .map((s) => s.trim())
  .filter(Boolean);

const extraAllowedOrigins = [
  ...parseOrigins(process.env.CORS_ORIGINS),
  ...parseOrigins(process.env.CLIENT_URLS)
];

const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL,
    vercelOrigin,
    ...extraAllowedOrigins,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ].filter(Boolean)
);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin) || /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  // Ensure browser preflight allows Authorization and content-type headers
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Bus Ticket Management API is healthy' });
});

// Basic root route for platforms that hit `/`
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Bus Ticket Management API - root' });
});

// Avoid noisy 404s from browsers requesting favicon
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
// Dev debug endpoints
app.use('/api/debug', debugRoutes);

// Serve uploaded files (local fallback for images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(notFound);
app.use(errorHandler);

module.exports = app;