import dotenv from 'dotenv';
import connectToDatabase from './lib/mongodb';
import app from './app';

// Load environment variables
dotenv.config();

// Set port from environment variables or use default
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server after successful database connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Export the app for testing purposes
export default app;
