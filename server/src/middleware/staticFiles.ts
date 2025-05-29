import express from 'express';
import path from 'path';

// Configure static file serving
const configureStaticFiles = (app: express.Application) => {
  // Serve uploaded files from the uploads directory
  const uploadsPath = path.join(__dirname, '../../uploads');
  app.use('/uploads', express.static(uploadsPath));
  
  console.log(`Static files configured: serving uploads from ${uploadsPath}`);
};

export default configureStaticFiles;
