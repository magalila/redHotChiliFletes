import type { Request, Response } from 'express';
import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    const { nombre, email, password, rol, telefono, dni } = req.body;

    try {
        // 1. Generar la "sal" (salt) para la encriptación
        const saltRounds = 10;
        
        // 2. Encriptar la contraseña de forma asíncrona
        const passwordEncriptada = await bcrypt.hash(password, saltRounds);

        // 3. Guardar el usuario con la contraseña protegida
        const newUser = await db.user.create({
            data: {
                nombre,
                email,
                dni,
                passwordHash: passwordEncriptada, // Guardamos el hash, no el texto plano
                rol, 
                telefono,
        
            }
        });

        res.status(201).json({ 
            mensaje: 'Usuario creado con éxito', 
            usuario: newUser.email 
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'El email o DNI ya existen, o datos inválidos' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar si el usuario existe
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 2. Comparar la contraseña enviada con el hash de la base de datos
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // 3. Si todo está ok, generamos un Token (llave digital)
        // Usamos una frase secreta para firmar el token (en producción va al .env)
        const token = jwt.sign(
            { userId: user.id, rol: user.rol },
            'MI_FRASE_SUPER_SECRETA', 
            { expiresIn: '8h' }
        );

       // En auth.controller.ts - Función login
res.json({
    mensaje: 'Login exitoso',
    token,
    usuario: { // Asegúrate de que se llame 'usuario' para que login.js lo encuentre
        nombre: user.nombre, 
        rol: user.rol 
    }
});
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}
