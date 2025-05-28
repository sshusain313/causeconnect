#!/bin/bash

echo "Applying direct fix for server deployment..."

# Force install helmet package
echo "Installing helmet package directly..."
pnpm add helmet --force

# Create a simple index.js file that bypasses TypeScript
echo "Creating direct JavaScript entry point..."
mkdir -p dist

cat > dist/index.js << 'EOL'
console.log('Starting server with direct JavaScript entry point...');

// Require necessary modules
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://causeconnect.netlify.app', 'https://www.causeconnect.netlify.app'] 
    : ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:8083', 'http://localhost:3000'],
  credentials: true
}));

// Configure static file serving
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log(`Creating uploads directory: ${uploadsPath}`);
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

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
  res.json({ message: 'CauseConnect API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
EOL

echo "Direct fix applied! You can now run 'node dist/index.js' to start the server."
echo "This is a temporary solution to get the server running. For a complete solution, you may need to fix the package.json and reinstall dependencies."
