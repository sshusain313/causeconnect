import express from 'express';
import { upload, uploadLogo } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Upload logo endpoint - public access for sponsors to upload logos
router.post('/logo', upload.single('logo'), uploadLogo);

export default router;
