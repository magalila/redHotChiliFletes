import type { Request, Response } from 'express';
import db from '../db.js';

export const getPendingVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await db.vehicle.findMany({
            where: { 
                estaHabilitado: false // Los vehículos que aún no fueron aprobados
            },
            include: { 
                proveedor: { 
                    select: { 
                        nombre: true, 
                        email: true 
                    } 
                } 
            }
        });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener vehículos pendientes' });
    }
};

export const updateVehicleStatus = async (req: Request, res: Response) => {
    // Forzamos el ID a string para evitar el error de 'string | string[]'
    const { id } = req.params as { id: string }; 
    const { habilitar } = req.body; // Recibimos un booleano: true o false

    try {
        await db.vehicle.update({
            where: { id },
            data: { 
                estaHabilitado: habilitar 
            }
        });
        res.json({ mensaje: habilitar ? 'Vehículo habilitado' : 'Vehículo deshabilitado' });
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar habilitación del vehículo' });
    }
};

export const createVehicle = async (req: Request, res: Response) => {
    const { 
        id_proveedor, 
        tipo_vehiculo, 
        patente, 
        modelo, 
        capacidadVol, 
        capacidadPeso, 
        estaHabilitado 
    } = req.body;

    try {
        const newVehicle = await db.vehicle.create({
            data: {
                id_proveedor,
                tipo_vehiculo, // Debe ser "MOTO", "FLETE" o "CAMIONETA"
                patente,
                modelo,
                capacidadVol,
                capacidadPeso,
                // Si el body trae el valor lo usa, sino por defecto es false
                estaHabilitado: estaHabilitado ?? false 
            }
        });

        res.status(201).json(newVehicle);
    } catch (error) {
        console.error("Error al crear vehículo:", error);
        res.status(400).json({ error: "Error en los datos o patente duplicada" });
    }
};