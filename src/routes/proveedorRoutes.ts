import { Router } from 'express';
import { getProveedoresActivos, actualizarDatosProveedor, getProveedorStats, getDatosProveedor } from '../controllers/proveedorController.js';
import { verificarToken, esAdmin, esProveedor } from '../middlewares/authMiddleware.js';

const router = Router();

// 📊 Dashboard del proveedor
router.get('/activos', verificarToken, esAdmin, getProveedoresActivos);

// ✏️ Actualizar datos del perfil del proveedor
router.put('/perfil', verificarToken, esProveedor, actualizarDatosProveedor);
router.get('/stats', verificarToken, esProveedor, getProveedorStats);
router.get('/datos', verificarToken, getDatosProveedor);

export default router;
