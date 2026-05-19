const serverless = require('serverless-http');
const app = require('../app');
const connectDB = require('../config/db');

const handler = serverless(app);

module.exports = async (req, res) => {
	try {
		// Avoid blocking root page loads (/) on DB connectivity.
		// Only connect for API routes (except health).
		const url = req?.url || '';
		const shouldConnect = url.startsWith('/api/') && url !== '/api/health';

		if (shouldConnect) {
			await connectDB();
		}

		return handler(req, res);
	} catch (err) {
		// If connectDB() fails before Express runs, ensure we still reply.
		// Otherwise Vercel can keep the connection open until platform timeout.
		console.error('Vercel handler error:', err);
		res.statusCode = 500;
		res.setHeader('Content-Type', 'application/json');
		res.end(
			JSON.stringify({
				success: false,
				message: 'Server error',
				error: process.env.NODE_ENV === 'production' ? undefined : String(err?.message || err)
			})
		);
	}
};
