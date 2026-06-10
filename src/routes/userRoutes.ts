import { Router } from 'express';
import { updateProfile, uploadDocuments, changePassword } from '../controllers/userController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.put('/profile', verificarToken, updateProfile);
router.post('/documents', verificarToken, uploadDocuments);
router.put('/password', verificarToken, changePassword);

export default router;
