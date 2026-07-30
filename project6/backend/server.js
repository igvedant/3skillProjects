import { setServers } from 'node:dns/promises';
setServers(["1.1.1.1", "8.8.8.8"]);
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

// Connect to MongoDB using MONGO_URI from .env
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'HavenKey MERN Real Estate API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`HavenKey REST API Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
