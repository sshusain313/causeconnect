/**
 * Emergency server implementation that doesn't rely on TypeScript or helmet
 * This is a minimal server that can be used when the regular server fails to start
 */

// Load environment variables
require('dotenv').config();

// Require only essential modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();

console.log('Starting emergency server...');

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS without helmet
app.use(cors({
  origin: '*', // Allow all origins for emergency mode
  credentials: true
}));

// Add basic security headers manually (instead of using helmet)
app.use((req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Configure static file serving
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log(`Creating uploads directory: ${uploadsPath}`);
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));
console.log(`Static files configured: serving uploads from ${uploadsPath}`);

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

console.log('MongoDB URI:', MONGODB_URI ? 'URI is defined' : 'URI is not defined');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // List available collections
    mongoose.connection.db.listCollections().toArray()
      .then(collections => {
        console.log('Available collections:', collections.map(c => c.name));
      })
      .catch(err => console.error('Error listing collections:', err));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'CauseConnect API is running in emergency mode',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Basic API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'emergency' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Emergency server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to verify the server is working`);
  console.log('This is a minimal emergency implementation.');
  console.log('For full functionality, you will need to fix the package installation issues.');
});
