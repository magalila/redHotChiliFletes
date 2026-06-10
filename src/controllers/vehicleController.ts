import type { Request, Response } from 'express';
import db from '../db.js';

// 🔹 Obtener vehículos pendientes
export const getPendingVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await db.vehicle.findMany({
      where: { estado: "PENDIENTE" },
      include: {
        proveedor: { select: { id: true, nombre: true, email: true, telefono: true } }
      }
    });
    res.json(vehicles);
  } catch (error) {
    const err = error as Error;
    console.error("Error detallado en getPendingVehicles:", err.message);
    res.status(500).json({ error: "Error al obtener flota", detalle: err.message });
  }
};

// 🔹 Crear vehículo
export const createVehicle = async (req: Request, res: Response) => {
  const {
    id_proveedor,
    tipo_vehiculo,
    patente,
    modelo,
    capacidadVol,
    capacidadPeso
  } = req.body;

  try {
    const newVehicle = await db.vehicle.create({
      data: {
        id_proveedor,
        tipo_vehiculo,
        patente,
        modelo,
        capacidadVol,
        capacidadPeso,
        estado: "PENDIENTE"
      }
    });

    res.status(201).json(newVehicle);
  } catch (error) {
    console.error("Error al crear vehículo:", error);
    res.status(400).json({ error: "Error en los datos o patente duplicada" });
  }
};

// 🔹 Actualizar estado de vehículo
export const updateVehicleStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { accion } = req.body;

    const nuevoEstado =
      accion === 'APROBAR' ? "APROBADO" :
      accion === 'RECHAZAR' ? "RECHAZADO" : "PENDIENTE";

    const vehicle = await db.vehicle.update({
      where: { id },
      data: { estado: nuevoEstado, fechaGestion: new Date() },
    });

    res.json({ mensaje: `Vehículo ${nuevoEstado.toLowerCase()}`, vehicle });
  } catch (error) {
    console.error("Error en updateVehicleStatus:", error);
    res.status(500).json({ error: 'Error al actualizar estado del vehículo' });
  }
};

// 🔹 Obtener vehículos por proveedor
export const getVehiclesByProveedor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const vehicles = await db.vehicle.findMany({
      where: { id_proveedor: String(id) },
      include: { proveedor: true }
    });
    res.json(vehicles);
  } catch (error) {
    console.error("Error al obtener vehículos del proveedor:", error);
    res.status(500).json({ error: "Error al obtener vehículos del proveedor" });
  }
};
