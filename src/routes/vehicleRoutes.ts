import { Router } from 'express';
import { 
    getPendingVehicles, 
    updateVehicleStatus, 
    createVehicle // <--- Asegúrate de importarlo
} from '../../src/controllers/vehicleController.js';
import { verificarToken, esAdmin } from '../../src/middlewares/authMiddleware.js';

const router = Router();

// NUEVA RUTA: Registrar vehículo (lo hace el Proveedor)
router.post('/', verificarToken, createVehicle);

// Solo el ADMIN puede gestionar la flota
router.get('/pending', verificarToken, esAdmin, getPendingVehicles);
router.patch('/:id/status', verificarToken, esAdmin, updateVehicleStatus);

export default router;