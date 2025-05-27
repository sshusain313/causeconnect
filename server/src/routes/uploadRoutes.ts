import { upload, uploadLogo } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';
import { createRouter } from '../utils/routerHelper';

const router = createRouter();

// Upload logo endpoint - public access for sponsors to upload logos
router.post('/logo', upload.single('logo'), uploadLogo);

export default router;
