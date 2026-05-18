const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const app = require('./app');

const PORT = Number(process.env.PORT) || 5000;
const MAX_PORT_TRIES = 5;

const startServer = async () => {
  try {
    await connectDB();

    let attempt = 0;
    const tryListen = (port) => {
      attempt += 1;
      const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });

      server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is already in use.`);
          if (attempt <= MAX_PORT_TRIES) {
            const nextPort = port + 1;
            console.log(`Trying next port: ${nextPort} (attempt ${attempt}/${MAX_PORT_TRIES})`);
            // give a short delay before retrying
            setTimeout(() => tryListen(nextPort), 300);
            return;
          }
          console.error(`Failed to bind after ${MAX_PORT_TRIES} attempts. Please free a port or set PORT in .env.`);
          return;
        }
        console.error('Server error:', err);
      });
    };

    tryListen(PORT);
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();