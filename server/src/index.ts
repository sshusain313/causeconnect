import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import connectToDatabase from './lib/mongodb';
import authRoutes from './routes/auth';
import causeRoutes from './routes/causes';
import sponsorshipRoutes from './routes/sponsorshipRoutes';
import claimRoutes from './routes/claims';
import uploadRoutes from './routes/uploadRoutes';
import otpRoutes from './routes/otpRoutes';
import { authGuard, adminGuard } from './middleware/authGuard';
import configureStaticFiles from './middleware/staticFiles';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://causebags-application.windsurf.build', 'https://causeconnect-application.netlify.app'] 
    : ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'], // Allow development ports
  credentials: true
}));

// Configure Helmet for security headers with appropriate CSP - Updated for Render deployment
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com", "https://*.vercel.app"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.vercel.app", "https://gs-extension-embeds-final.vercel.app"],
      styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.vercel.app", "https://gs-extension-embeds-final.vercel.app"],
      imgSrc: ["'self'", "data:", "https://*", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com", "https://*.vercel.app"],
      connectSrc: ["'self'", "https://*"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Configure static file serving for uploaded files
configureStaticFiles(app);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  
  // Capture the original send method
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`[${new Date().toISOString()}] Response:`, typeof body === 'string' ? body : JSON.stringify(body));
    return originalSend.call(this, body);
  };
  
  next();
});

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Note: We'll run the seed script separately
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/causes', causeRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/otp', otpRoutes);

// Protected route example
app.get('/api/profile', authGuard, (req, res) => {
  res.json({ 
    message: 'Profile data', 
    user: {
      id: req.user?._id,
      email: req.user?.email,
      role: req.user?.role,
      name: req.user?.name
    } 
  });
});

// Admin-only route example
app.get('/api/admin', authGuard, adminGuard, (req, res) => {
  res.json({ message: 'Admin dashboard data' });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
