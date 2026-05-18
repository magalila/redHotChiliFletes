import type { Request, Response } from 'express';
import db from '../db.js';



export const getPendingVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await db.vehicle.findMany({
            where: { estado: "PENDIENTE" },
            include: { proveedor: true }
        });
        res.json(vehicles);
    } catch (error) {
        const err = error as Error;
        console.error("Error detallado en getPendingVehicles:", err.message);
        res.status(500).json({ error: "Error al obtener flota", detalle: err.message });
    }
};


export const updateVehicleStatus = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    //const { id } = req.params;
    const { accion } = req.body; // El front envía "APROBAR" o "RECHAZAR"
    const nuevoEstado =
        accion === 'APROBAR'
            ? "APROBADO"
            : accion === 'RECHAZAR'
                ? "RECHAZADO"
                : "PENDIENTE";
    try {
        await db.vehicle.update({
            where: { id },
            data: {
                estado: nuevoEstado,
                fechaGestion: new Date()
            }
        });
        res.json({ mensaje: `El vehículo ahora está ${nuevoEstado}` });
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el estado' });
    }
};


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