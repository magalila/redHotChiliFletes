import { Router } from 'express';
import { login, register } from '../controllers/authController.js';

const router = Router();

// Definimos que el camino "/register" ejecute la función 'register'
router.post('/register', register);
router.post('/login', login);

export default router;