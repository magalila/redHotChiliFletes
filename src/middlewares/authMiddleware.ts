import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export const verificarToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No hay token' });

    try {
        const decoded = jwt.verify(token, 'MI_FRASE_SUPER_SECRETA') as any;
        // Inyectamos ID y ROL para que las rutas de ADMIN funcionen
        (req as any).userId = decoded.userId; 
        (req as any).rol = decoded.rol; 
        next();
    } catch (error) {
        res.status(403).json({ error: 'Token inválido' });
    }
};




// CLAVE: Asegurate que diga 'export'
export const esAdmin = (req: Request, res: Response, next: NextFunction) => {
    const rol = (req as any).rol;

    if (rol !== 'ADMIN') {
        return res.status(403).json({ 
            error: 'Acceso denegado: Se requieren permisos de administrador.' 
        });
    }
    
    next();
};