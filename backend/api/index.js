const serverless = require('serverless-http');
const app = require('../app');
const connectDB = require('../config/db');

const handler = serverless(app);

module.exports = async (req, res) => {
	// Avoid blocking root page loads (/) on DB connectivity.
	// Only connect for API routes (except health).
	const url = req?.url || '';
	const shouldConnect = url.startsWith('/api/') && url !== '/api/health';

	if (shouldConnect) {
		await connectDB();
	}

	return handler(req, res);
};
