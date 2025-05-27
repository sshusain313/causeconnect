import express, { Request, Response, Application } from 'express';
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
const app: Application = express();

// Middleware
// Using type assertions to fix TypeScript errors
app.use((express as any).json());
app.use((express as any).urlencoded({ extended: true }));
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
// Using type assertion to fix TypeScript errors
app.use('/api/auth', authRoutes as any);
app.use('/api/causes', causeRoutes as any);
app.use('/api/sponsorships', sponsorshipRoutes as any);
app.use('/api/claims', claimRoutes as any);
app.use('/api/upload', uploadRoutes as any);
app.use('/api/otp', otpRoutes as any);

// Protected route example
app.get('/api/profile', authGuard as any, (req: Request, res: Response) => {
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
app.get('/api/admin', [authGuard, adminGuard] as any, (req: Request, res: Response) => {
  res.json({ message: 'Admin dashboard data' });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

export default app;