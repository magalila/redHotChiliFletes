import express from 'express';
import cors from 'cors';

// Importamos las rutas
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import proveedorRoutes from './routes/proveedorRoutes.js';

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚠️ IMPORTANTE: NO usar express.json() ni express-fileupload antes de Multer
// Estos middlewares consumen el cuerpo del request y rompen el flujo de archivos multipart/form-data.
// app.use(express.json());
// app.use(fileUpload({ createParentPath: true }));

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// --- REGISTRO DE RUTAS ---
app.use('/api/users', authRoutes);       // login y registro
app.use('/api/orders', orderRoutes);     // pedidos
app.use('/api/vehicles', vehicleRoutes); // vehículos
app.use('/api/proveedor', proveedorRoutes); // proveedores

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'operativo', base_de_datos: 'Neon/PostgreSQL' });
});

// --- EL LISTEN SIEMPRE AL FINAL ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
