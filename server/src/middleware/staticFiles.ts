import path from 'path';

// Configure static file serving
const configureStaticFiles = (app: any) => {
  // Serve uploaded files from the uploads directory
  const uploadsPath = path.join(__dirname, '../../uploads');
  
  // Use a simple middleware function instead of express.static
  app.use('/uploads', (req: any, res: any, next: any) => {
    const filePath = path.join(uploadsPath, req.path);
    res.sendFile(filePath, (err: any) => {
      if (err) {
        next();
      }
    });
  });
  
  console.log(`Static files configured: serving uploads from ${uploadsPath}`);
};

export default configureStaticFiles;
