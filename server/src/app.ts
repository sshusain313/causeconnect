import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet';
import authRoutes from './routes/auth';
import causeRoutes from './routes/causes';
import sponsorshipRoutes from './routes/sponsorshipRoutes';
import claimRoutes from './routes/claims';
import uploadRoutes from './routes/uploadRoutes';
import otpRoutes from './routes/otpRoutes';
import { authGuard, adminGuard } from './middleware/authGuard';
import configureStaticFiles from './middleware/staticFiles';
import copyUploadsToPublic from './utils/copyUploadsToPublic';

// Create Express app
const app: Application = express();

// Middleware
// Using type assertions to fix TypeScript errors
app.use((express as any).json());
app.use((express as any).urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://changebag.org', 'https://www.changebag.org'] 
    : true, // Allow any origin in development mode
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure Helmet for security headers with appropriate CSP - Updated for Render deployment
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com", "https://*.vercel.app"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.vercel.app", "https://gs-extension-embeds-final.vercel.app"],
      styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.vercel.app", "https://gs-extension-embeds-final.vercel.app"],
      imgSrc: ["'self'", "data:", "https://*", "blob:", "http://localhost:*"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com", "https://*.vercel.app"],
      connectSrc: ["'self'", "https://*", "http://localhost:*"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configure static file serving for uploaded files
configureStaticFiles(app);

// Copy uploaded files to public directory for frontend access
copyUploadsToPublic();
console.log('Copied uploaded files to public directory');

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

// Root route handler
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'CauseConnect API Server',
    version: '1.0.0',
    documentation: '/api/health',
    endpoints: [
      '/api/auth',
      '/api/causes',
      '/api/sponsorships',
      '/api/claims',
      '/api/upload',
      '/api/otp',
      '/api/profile',
      '/api/admin',
      '/api/health'
    ]
  });
});

export default app;