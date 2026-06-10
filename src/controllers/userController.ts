import type { Request, Response } from 'express';
import db from '../db.js';
import bcrypt from 'bcryptjs';
import { saveFile } from '../utils/fileUtils.js';

// 🔹 Actualizar perfil del usuario
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body; // o desde token
    const { nombre, telefono } = req.body;

    const usuarioActualizado = await db.user.update({
      where: { id: userId },
      data: { nombre, telefono },
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar perfil' });
  }
};

// 🔹 Subir documentos adicionales
export const uploadDocuments = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body; // o desde token

    const fotoPerfil = req.files?.fotoPerfil ? saveFile(req.files.fotoPerfil, 'fotos') : null;
    const dniPdf = req.files?.dniPdf ? saveFile(req.files.dniPdf, 'dni') : null;
    const certificadoAntecedente = req.files?.certificadoAntecedente ? saveFile(req.files.certificadoAntecedente, 'antecedentes') : null;
    const licenciaConducir = req.files?.licenciaConducir ? saveFile(req.files.licenciaConducir, 'licencias') : null;

    const usuarioConDocs = await db.user.update({
      where: { id: userId },
      data: { fotoPerfil, dniPdf, certificadoAntecedente, licenciaConducir },
    });

    res.json(usuarioConDocs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al subir documentos' });
  }
};

// 🔹 Cambiar contraseña
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

    const newHash = await bcrypt.hash(newPassword, 10);

    const usuarioActualizado = await db.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al cambiar contraseña' });
  }
};
