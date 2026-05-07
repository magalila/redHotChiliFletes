import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';



const app = express();
app.use(cors({
    origin: 'http://127.0.0.1:5500', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Agregué PATCH para updateVehicleStatus
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- REGISTRO DE RUTAS ---
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes); 
app.use('/api/vehicles', vehicleRoutes); // <--- MOVIDO AQUÍ ARRIBA

app.get('/health', (req, res) => {
    res.json({ status: 'operativo', base_de_datos: 'Neon/PostgreSQL' });
});

// --- EL LISTEN SIEMPRE AL FINAL ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});