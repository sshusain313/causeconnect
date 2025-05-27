import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import authRoutes from './routes/auth';
import causeRoutes from './routes/causes';
import sponsorshipRoutes from './routes/sponsorshipRoutes';
import claimRoutes from './routes/claims';
import uploadRoutes from './routes/uploadRoutes';
import otpRoutes from './routes/otpRoutes';
import { authGuard, adminGuard } from './middleware/authGuard';
import configureStaticFiles from './middleware/staticFiles';

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://causeconnect.netlify.app', 'https://www.causeconnect.netlify.app'] 
    : ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000'], // Allow development ports
  credentials: true
}));

// Configure static file serving for uploaded files
configureStaticFiles(app);

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

export default app;