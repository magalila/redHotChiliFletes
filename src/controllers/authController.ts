import type { Request, Response } from 'express';
import db from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { saveFile } from '../utils/fileUtils.js';


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


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { nombre, dni, telefono, email, password } = req.body;
        if (!req.files || typeof req.files !== 'object') {
            return res.status(400).json({ error: 'No se subieron archivos válidos.' });
        }

        const files = req.files as unknown as { [fieldname: string]: Express.Multer.File[] };

        const passwordHash = await bcrypt.hash(password, 10);

        const fotoPerfil = files?.fotoPerfil?.[0]?.path || null;
        const dniPdf = files?.dniPdf?.[0]?.path || null;
        const certificadoAntecedente = files?.certificadoAntecedente?.[0]?.path || null;
        const licenciaConducir = files?.licenciaConducir?.[0]?.path || null;

        const nuevoUsuario = await db.user.create({
            data: {
                nombre,
                dni,
                telefono,
                email,
                passwordHash,
                fotoPerfil,
                dniPdf,
                certificadoAntecedente,
                licenciaConducir,
                rol: 'PROVEEDOR'
            }
        });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
