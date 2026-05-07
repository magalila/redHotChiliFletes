import type { Request, Response } from 'express';
import db from '../db.js';
import { OrderStatus } from '@prisma/client';
// export const createOrder = async (req: Request, res: Response) => {
//     // Ya no extraemos clienteId de req.body
//     const { tipo, paradas, distanciaTotal, precioTotal } = req.body;
//     // Lo tomamos de lo que inyectó el middleware
//     const clienteId = (req as any).userId;

//     try {
//         const newOrder = await db.order.create({
//             data: {
//                 tipo,
//                 clienteId, // Viene del Token, es 100% seguro
//                 distanciaTotal,
//                 precioTotal,
//                 comisionApp: precioTotal * 0.15,
//                 paradas: {
//                     create: paradas
//                 }
//             },
//             include: { paradas: true }
//         });

//         res.status(201).json({ mensaje: 'Pedido creado con éxito', pedido: newOrder });
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ error: 'Error al crear el pedido' });
//     }
// };
export const createOrder = async (req: Request, res: Response) => {
    const { tipo, paradas, distanciaTotal, precioTotal } = req.body;
    const clienteId = (req as any).userId;

    try {
        const newOrder = await db.order.create({
            data: {
                tipo,
                clienteId,
                distanciaTotal,
                precioTotal,
                comisionApp: precioTotal * 0.15,
                // MAPEO DE PARADAS: 
                // Aseguramos que los nombres del JSON coincidan con Prisma
                paradas: {
                    create: paradas.map((p: any) => ({
                        direccion: p.direccion,
                        lat: p.lat,
                        lng: p.lng,
                        ordenVisita: p.ordenVisita, // Antes tenías 'orden'
                        esEntrega: p.esEntrega      // Antes tenías 'tipo'
                    }))
                }
            },
            include: { paradas: true }
        });

        res.status(201).json({ mensaje: 'Pedido creado con éxito', pedido: newOrder });
    } catch (error) {
        // Log detallado para ver qué columna falla exactamente
        console.error("Error detallado de Prisma:", error);
        res.status(400).json({ error: 'Error al crear el pedido en la base de datos' });
    }
};


export const getMyOrders = async (req: Request, res: Response) => {
    // El ID lo sacamos del Token, igual que hicimos con la creación
    const clienteId = (req as any).userId;

    try {
        const orders = await db.order.findMany({
            where: {
                clienteId: clienteId
            },
            include: {
                paradas: true // Incluimos las paradas para que vea origen y destino
            },
            orderBy: {
                createdAt: 'desc' // Los más recientes primero
            }
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tus pedidos' });
    }
};

// 1. Ver pedidos disponibles para cualquier proveedor
export const getAvailableOrders = async (req: Request, res: Response) => {
    try {
        const orders = await db.order.findMany({
            where: {
                // 2. Usar el Enum en lugar de un string manual
                estado: OrderStatus.BUSCANDO
            },
            include: {
                paradas: true,
                cliente: { select: { nombre: true } }
            }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar fletes disponibles' });
    }
};

export const acceptOrder = async (req: Request, res: Response) => {
    // 3. Forzar que orderId sea tratado como string con "as string"
    const orderId = req.params.orderId as string;
    const proveedorId = (req as any).userId;

    try {
        const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: {
                proveedorId: proveedorId,
                // 4. Usar el Enum aquí también
                estado: OrderStatus.ASIGNADO
            }
        });
        res.json({ mensaje: '¡Pedido aceptado!', pedido: updatedOrder });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'No se pudo aceptar el pedido' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const orderId = req.params.orderId as string;
    const { nuevoEstado } = req.body; // Recibimos el estado desde el body de Postman
    const proveedorId = (req as any).userId;

    try {
        // Verificamos que el pedido pertenezca a este proveedor antes de cambiar el estado
        const order = await db.order.findUnique({ where: { id: orderId } });

        if (!order || order.proveedorId !== proveedorId) {
            return res.status(403).json({ error: 'No tenés permiso para modificar este pedido.' });
        }

        const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: { estado: nuevoEstado as OrderStatus }
        });

        res.json({
            mensaje: `Estado actualizado a ${nuevoEstado}`,
            pedido: updatedOrder
        });
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el estado.' });
    }
};

export const getProviderOrders = async (req: Request, res: Response) => {
    // El ID lo tomamos del token inyectado por el middleware
    const proveedorId = (req as any).userId;

    try {
        const orders = await db.order.findMany({
            where: {
                proveedorId: proveedorId
            },
            include: {
                paradas: true,
                cliente: { select: { nombre: true } }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener tu historial de trabajos' });
    }
};


export const getAdminStats = async (req: Request, res: Response) => {
    try {
        // 1. Agregamos sumas y conteos totales
        const stats = await db.order.aggregate({
            _sum: {
                precioTotal: true,
                comisionApp: true
            },
            _count: {
                id: true
            }
        });

        // 2. Traemos solo los pedidos que ya están finalizados (ENTREGADO)
        const pedidosFinalizados = await db.order.count({
            where: { estado: 'ENTREGADO' }
        });

        // 3. Respuesta limpia para el frontend
        res.json({
            totalMovido: stats._sum.precioTotal || 0,
            gananciaPlataforma: stats._sum.comisionApp || 0,
            totalPedidos: stats._count.id, // Nombre alineado con el HTML
            pedidosCompletados: pedidosFinalizados
        });
    } catch (error) {
        console.error("Error al generar KPIs:", error);
        res.status(500).json({ error: 'Error al generar estadísticas' });
    }
};



// En tu controlador de vehículos
// export const getPendingVehicles = async (req: Request, res: Response) => {
//     try {
//         const vehicles = await db.vehicle.findMany({
//             where: { estaHabilitado: false },
//             include: {
//                 proveedor: true // <--- ¡ESTO ES LO QUE TE FALTA PARA QUE APAREZCA EL NOMBRE!
//             }
//         });
//         res.json(vehicles);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al obtener flota' });
//     }
// };
// En tu controlador de vehículos
// En orderController.ts
export const getPendingVehicles = async (req: Request, res: Response) => {
    try {
        const vehicles = await db.vehicle.findMany({
            where: { estaHabilitado: false },
            include: {
                proveedor: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        telefono: true // <-- ESTO OBLIGA A PRISMA A TRAERLO
                    }
                }
            }
        });

        // Agregá este log para ver en la terminal de VS Code si el servidor lo tiene
        console.log("DATOS DESDE BD:", JSON.stringify(vehicles[0]?.proveedor, null, 2));

        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener flota' });
    }
};
export const updateVehicleStatus = async (req: Request, res: Response) => {
    // Línea 239: Solucionamos el error 'string | string[]' asegurando que es string
    const id = req.params.id as string; 
    
    // Suponiendo que el Admin envía un booleano para habilitar/deshabilitar
    const { habilitar } = req.body; 

    try {
        await db.vehicle.update({
            where: { id: id },
            data: { 
                // Línea 240: Cambiamos 'estado' por 'estaHabilitado'
                estaHabilitado: habilitar 
            }
        });
        res.json({ mensaje: 'Estado del vehículo actualizado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'No se pudo actualizar el vehículo' });
    }
};