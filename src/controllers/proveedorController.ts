import type { Request, Response } from 'express';
import db from '../db.js';

// Proveedores activos
export const getProveedoresActivos = async (_req: Request, res: Response) => {
  try {
    const proveedores = await db.user.findMany({
      where: { rol: 'PROVEEDOR' },
      include: { vehiculos: true }
    });
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proveedores', detalle: error });
  }
};
// 🔹 Actualizar datos del proveedor
export const actualizarDatosProveedor = async (req: Request, res: Response) => {
  const proveedorId = (req as any).userId;
  const { nombre, telefono, email } = req.body;

  try {
    const proveedorActualizado = await db.user.update({
      where: { id: proveedorId },
      data: { nombre, telefono, email }
    });

    res.json({ mensaje: 'Datos actualizados correctamente', proveedor: proveedorActualizado });
  } catch (error) {
    console.error('Error al actualizar datos del proveedor:', error);
    res.status(500).json({ error: 'Error al actualizar datos del proveedor' });
  }
};

export const getProveedorStats = async (req: Request, res: Response) => {
  const proveedorId = (req as any).userId;
  try {
    const pedidosActivos = await db.order.count({ where: { proveedorId, estado: 'ASIGNADO' } });
    const gananciaTotal = await db.order.aggregate({ _sum: { precioTotal: true } });
    const vehiculosRegistrados = await db.vehicle.count({ where: { id_proveedor: proveedorId } });

    res.json({
      pedidosActivos,
      gananciaTotal: gananciaTotal._sum.precioTotal || 0,
      vehiculosRegistrados
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas del proveedor' });
  }
};


export const getDatosProveedor = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // viene del token
    const proveedor = await db.user.findUnique({
      where: { id: userId },
      include: {
        vehiculos: {
          include: { documentos: true }
        }
      }
    });


    res.json(proveedor);
  } catch (error) {
    console.error('Error al obtener datos del proveedor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
