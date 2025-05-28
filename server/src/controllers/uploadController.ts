import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Function to copy uploaded file to public directory
const copyToPublic = (filename: string): string => {
  const sourcePath = path.join(__dirname, '../../uploads', filename);
  const publicUploadsDir = path.join(__dirname, '../../../public/uploads');
  const destPath = path.join(publicUploadsDir, filename);
  
  // Create public uploads directory if it doesn't exist
  if (!fs.existsSync(publicUploadsDir)) {
    console.log(`Creating public uploads directory: ${publicUploadsDir}`);
    fs.mkdirSync(publicUploadsDir, { recursive: true });
  }
  
  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${filename} to public uploads directory`);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error(`Error copying ${filename} to public directory: ${err}`);
    return `/uploads/${filename}`; // Return the path anyway
  }
};

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  console.log(`Creating uploads directory: ${uploadDir}`);
  fs.mkdirSync(uploadDir, { recursive: true });
} else {
  console.log(`Uploads directory exists: ${uploadDir}`);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'logo-' + uniqueSuffix + ext);
  }
});

// Create multer upload instance
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Handle logo upload
export const uploadLogo = (req: Request, res: Response): void => {
  try {
    console.log('Upload request received:', req.file ? 'File included' : 'No file');
    
    if (!req.file) {
      console.log('No file in request');
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    console.log('File details:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Generate URL for the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    console.log('Generated file URL:', fileUrl);
    
    // Check if the file exists in the uploads directory
    const filePath = path.join(__dirname, '../../uploads', req.file.filename);
    const fileExists = fs.existsSync(filePath);
    console.log(`File exists at ${filePath}: ${fileExists}`);
    
    // Copy the file to the public directory for frontend access
    const publicUrl = copyToPublic(req.file.filename);
    console.log('Copied to public directory, accessible at:', publicUrl);
    
    res.status(200).json({ 
      message: 'File uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};
