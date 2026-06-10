import { Router } from 'express';
import { createOrder, getMyOrders, getAvailableOrders, acceptOrder, updateOrderStatus, getAdminStats } from '../controllers/orderController.js';
import { getProveedoresActivos } from '../controllers/proveedorController.js';

import { verificarToken } from '../middlewares/authMiddleware.js'; // Importamos el portero
import { createOrderSchema } from '../schemas/orderSchema.js';
import { validarEsquema } from '../middlewares/validationMiddleware.js';
const router = Router();

router.post('/create', verificarToken, validarEsquema(createOrderSchema), createOrder);router.get('/my-orders', verificarToken, getMyOrders);  
router.get('/available', verificarToken, getAvailableOrders); 
router.patch('/accept/:orderId', verificarToken, acceptOrder);
router.patch('/status/:orderId', verificarToken, updateOrderStatus);
router.get('/provider/my-jobs', verificarToken, getProveedoresActivos);
router.get('/admin/stats', verificarToken, getAdminStats);

export default router;