import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { verifyDatabaseConnection, closeDatabaseDriver } from './config/database.js';
import fraudRoutes from './routes/fraudRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Security and utility middleware
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

// Public Authentication API routes
app.use('/api/auth', authRoutes);

// Protected Fraud Detection API routes (requires valid JWT)
app.use('/api/fraud', authenticateToken, fraudRoutes);

// Public database-aware health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await verifyDatabaseConnection();

  if (dbStatus.connected) {
    return res.status(200).json({
      status: 'healthy',
      service: 'fraud-network-tracker-api',
      database: 'connected',
    });
  }

  return res.status(503).json({
    status: 'unhealthy',
    service: 'fraud-network-tracker-api',
    database: 'disconnected',
  });
});

// Startup flow
async function startServer() {
  // Check initial database connectivity (non-blocking for HTTP startup)
  try {
    const dbStatus = await verifyDatabaseConnection();
    if (dbStatus.connected) {
      console.log('[CognoDB] Connected successfully over Bolt protocol.');
    } else {
      console.warn('[CognoDB] Database connection unavailable at startup. Starting server in degraded mode.');
    }
  } catch (err) {
    console.warn(`[CognoDB] Initial check failed: ${err.message}. Starting server in degraded mode.`);
  }

  const server = app.listen(PORT, () => {
    console.log(`Fraud Network Tracker backend listening on port ${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Fatal server startup error:', err.message);
    process.exit(1);
  });

  // Graceful shutdown handling
  let isShuttingDown = false;
  async function gracefulShutdown(signal) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);

    server.close(async (err) => {
      if (err) {
        console.error('Error closing HTTP server:', err.message);
      } else {
        console.log('HTTP server closed.');
      }

      await closeDatabaseDriver();
      console.log('Process exiting cleanly.');
      process.exit(0);
    });
  }

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  return server;
}

startServer();

export default app;
