import express from 'express';
import { createClaim, getRecentClaims, getClaimById, updateClaimStatus, getClaimsStats } from '../controllers/claimController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/', createClaim);

// Protected routes (admin only)
router.get('/recent', authenticateToken, getRecentClaims);
router.get('/stats', authenticateToken, getClaimsStats);
router.get('/:id', authenticateToken, getClaimById);
router.patch('/:id/status', authenticateToken, updateClaimStatus);

export default router; 