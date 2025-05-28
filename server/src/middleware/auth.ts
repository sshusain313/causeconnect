import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header or cookies
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1] || req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check for mock token in development mode
    if (process.env.NODE_ENV === 'development' && token.startsWith('mock_token_')) {
      console.log('Using mock token in development mode');
      
      // For mock tokens, create a mock user
      // This is only for development and testing
      const mockUser = {
        _id: '123456789012345678901234', // Mock MongoDB ObjectId
        email: 'mock@example.com',
        name: 'Mock User',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      req.user = mockUser as any;
      return next();
    }

    // Verify token for real JWT tokens
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      
      // Get user from database
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};