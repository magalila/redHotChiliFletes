// import { Router } from 'express';
// import { login, registerUser } from '../controllers/authController.js';
// import multer from 'multer';
// import { verificarToken, esAdmin } from '../middlewares/authMiddleware.js';
// //import { getProveedoresActivos } from '../controllers/orderController.js';
// import { getProveedoresActivos } from '../controllers/proveedorController.js';
// const router = Router();

// // 🔹 Login de usuario
// router.post('/login', login);

// // 🔹 Ruta protegida para ADMIN
// router.get('/admin/proveedores', verificarToken, esAdmin, getProveedoresActivos);
// // Configuración básica de Multer
// const upload = multer({ dest: 'uploads/' });

// // Ruta de registro con manejo de archivos
// router.post(
//   '/register',
//   upload.fields([
//     { name: 'fotoPerfil', maxCount: 1 },
//     { name: 'dniPdf', maxCount: 1 },
//     { name: 'certificadoAntecedente', maxCount: 1 },
//     { name: 'licenciaConducir', maxCount: 1 }
//   ]),
//   registerUser
// );
// export default router;
import { Router } from 'express';
import multer from 'multer';
import { login, registerUser } from '../controllers/authController.js';
import { verificarToken, esAdmin } from '../middlewares/authMiddleware.js';
import { getProveedoresActivos } from '../controllers/proveedorController.js';

const router = Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Ruta de registro con manejo de archivos
router.post(
  '/register',
  upload.fields([
    { name: 'fotoPerfil', maxCount: 1 },
    { name: 'dniPdf', maxCount: 1 },
    { name: 'certificadoAntecedente', maxCount: 1 },
    { name: 'licenciaConducir', maxCount: 1 }
  ]),
  registerUser
);

// Login y rutas protegidas
router.post('/login', login);
router.get('/admin/proveedores', verificarToken, esAdmin, getProveedoresActivos);

export default router;
