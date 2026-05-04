import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
app.use(cors({
    origin: 'http://127.0.0.1:5500', // El origen exacto de tu Live Server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


// Todas las rutas de autenticación colgarán de "/api/auth"
app.use('/api/auth', authRoutes);
console.log("Cargando rutas de pedidos...");
app.use('/api/orders', orderRoutes); 

app.get('/health', (req, res) => {
    res.json({ status: 'operativo', base_de_datos: 'Neon/PostgreSQL' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
