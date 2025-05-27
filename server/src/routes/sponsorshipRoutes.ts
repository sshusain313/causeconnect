import {
  createSponsorship,
  getPendingSponsorships,
  approveSponsorship,
  rejectSponsorship,
  getSponsorshipById
} from '../controllers/sponsorshipController';
import { authenticateToken } from '../middleware/auth';
import { adminGuard } from '../middleware/authGuard';
import { createRouter } from '../utils/routerHelper';

const router = createRouter();

// Public routes
router.post('/', createSponsorship);

// Admin-only routes
router.get('/pending', authenticateToken, adminGuard, getPendingSponsorships);
router.patch('/:id/approve', authenticateToken, adminGuard, approveSponsorship);
router.patch('/:id/reject', authenticateToken, adminGuard, rejectSponsorship);

// Protected routes (require authentication)
router.get('/:id', authenticateToken, getSponsorshipById);

export default router; 