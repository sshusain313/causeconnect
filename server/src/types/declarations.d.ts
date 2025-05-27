// Type declarations for modules without TypeScript definitions
declare module 'express';
declare module 'cors';
declare module 'cookie-parser';
declare module 'dotenv';

// Type declaration for Express Request with user property
declare namespace Express {
  export interface Request {
    user?: any;
  }
}
