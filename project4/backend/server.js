const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./db');
const quizRoutes = require('./routes/quizRoutes');
const scoreRoutes = require('./routes/scoreRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database (with automatic fallback to JSON mode)
connectDB();

// API Endpoints
app.use('/api/quizzes', quizRoutes);
app.use('/api/scores', scoreRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('MERN Quiz App API is running successfully!');
});

// Start listening
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
  console.log(`Open http://localhost:${PORT}/api/quizzes to view default quizzes.`);
});
