import { Router } from 'express';
import { login, register } from '../controllers/authController.js';
// Importamos los middlewares de seguridad
import { verificarToken, esAdmin } from '../middlewares/authMiddleware.js';

// Importamos el controlador (fijate que la ruta sea correcta según tu carpeta)
import { getProveedoresActivos } from '../controllers/orderController.js';

const router = Router();

// Definimos que el camino "/register" ejecute la función 'register'
router.post('/register', register);
router.post('/login', login);
router.get('/admin/proveedores', verificarToken, esAdmin, getProveedoresActivos);
export default router;
