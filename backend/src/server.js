import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import os from 'os';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import ordersRouter from './routes/orders.js';
import paymentsRouter from './routes/payments.js';
import adminRouter from './routes/admin.js';
import interactionsRouter from './routes/interactions.js';
import { getStatusHtml } from './views/statusHtml.js';


const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configure CORS to allow local hosts and the production frontend URL
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://192.168.31.252:3000'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins for easy testing
    if (NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/interactions', interactionsRouter);

// Helper: format bytes to human-readable string
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper: format uptime seconds into a human-readable duration
const formatUptime = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  
  return parts.join(' ');
};

// Root route - visual status dashboard
app.get('/', (req, res) => {
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  const dbStates = {
    0: { label: 'Disconnected', color: '#ef4444' },
    1: { label: 'Connected', color: '#10b981' },
    2: { label: 'Connecting', color: '#f59e0b' },
    3: { label: 'Disconnecting', color: '#ef4444' }
  };
  const dbState = dbStates[mongoose.connection.readyState] || { label: 'Unknown', color: '#9ca3af' };
  const dbHost = mongoose.connection.readyState === 1 ? mongoose.connection.host : 'N/A';

  const stats = {
    env: NODE_ENV.charAt(0).toUpperCase() + NODE_ENV.slice(1),
    uptime: formatUptime(uptimeSeconds),
    memory: formatBytes(memoryUsage.heapUsed) + ' (heap)',
    nodeVersion: process.version,
    dbStatus: dbState.label,
    dbColor: dbState.color,
    dbHost: dbHost
  };
  
  res.setHeader('Content-Type', 'text/html');
  res.send(getStatusHtml(stats));
});

// JSON Healthcheck route
app.get('/api/health', (req, res) => {
  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  
  const dbStates = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };
  
  const dbState = dbStates[mongoose.connection.readyState] || 'Unknown';
  
  const healthStatus = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    env: NODE_ENV,
    uptime: {
      raw: uptimeSeconds,
      formatted: formatUptime(uptimeSeconds)
    },
    database: {
      status: dbState,
      host: mongoose.connection.readyState === 1 ? mongoose.connection.host : null,
      name: mongoose.connection.readyState === 1 ? mongoose.connection.name : null
    },
    system: {
      nodeVersion: process.version,
      platform: os.platform(),
      architecture: os.arch(),
      cpuCount: os.cpus().length,
      memory: {
        processHeapUsed: formatBytes(memoryUsage.heapUsed),
        processHeapTotal: formatBytes(memoryUsage.heapTotal),
        systemFree: formatBytes(freeMem),
        systemTotal: formatBytes(totalMem),
        systemUsagePercentage: ((1 - freeMem / totalMem) * 100).toFixed(1) + '%'
      }
    }
  };
  
  res.status(200).json(healthStatus);
});

// Start Server
const server = app.listen(PORT, async () => {
  console.log(`=========================================`);
  console.log(`🚀 Krushisarthi API Server Started`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`⚙️  Environment: ${NODE_ENV}`);
  console.log(`🔗 Local Link: http://localhost:${PORT}`);
  console.log(`=========================================`);
  
  // Connect to MongoDB Atlas
  await connectDB();
});

// Graceful Shutdown
const shutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
