import express, { Router } from 'express';
import { authGuard, adminGuard } from '../middleware/authGuard';
import causeController from '../controllers/causeController';
import upload from '../middleware/fileUpload';

const router: Router = express.Router();

// Public routes
router.get('/', causeController.getAllCauses);
router.get('/:id', causeController.getCauseById);

// Protected routes (require authentication)
router.post('/', authGuard, upload.single('image'), causeController.createCause);
router.put('/:id', authGuard, causeController.updateCause);
router.delete('/:id', authGuard, causeController.deleteCause);
// Route for getting causes by user ID (current user if no ID provided)
router.get('/user/:userId', authGuard, causeController.getCausesByUser);
router.get('/user', authGuard, causeController.getCausesByUser);

// Admin routes
router.patch('/:id/status', authGuard, adminGuard, causeController.updateCauseStatus);

export default router;
