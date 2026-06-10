import { Router } from 'express';
import { 
    getPendingVehicles, 
    updateVehicleStatus, 
    createVehicle 
} from '../../src/controllers/vehicleController.js';
import { verificarToken, esAdmin } from '../../src/middlewares/authMiddleware.js';
import { getVehiclesByProveedor } from '../../src/controllers/vehicleController.js';


const router = Router();

router.post('/', verificarToken, createVehicle);
router.get('/pending', verificarToken, esAdmin, getPendingVehicles);
router.patch('/:id/status', verificarToken, esAdmin, updateVehicleStatus);


router.get('/proveedor/:id', verificarToken, esAdmin, getVehiclesByProveedor);

export default router;