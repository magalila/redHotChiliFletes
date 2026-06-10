// import type { Request, Response } from 'express';
// import db from '../db.js';
// import { OrderStatus } from '@prisma/client';
// export const createOrder = async (req: Request, res: Response) => {
//     const { tipo, paradas, distanciaTotal, precioTotal } = req.body;
//     const clienteId = (req as any).userId;

//     try {
//         const newOrder = await db.order.create({
//             data: {
//                 tipo,
//                 clienteId,
//                 distanciaTotal,
//                 precioTotal,
//                 comisionApp: precioTotal * 0.15,
//                 // MAPEO DE PARADAS: 
//                 paradas: {
//                     create: paradas.map((p: any) => ({
//                         direccion: p.direccion,
//                         lat: p.lat,
//                         lng: p.lng,
//                         ordenVisita: p.ordenVisita,
//                         esEntrega: p.esEntrega
//                     }))
//                 }
//             },
//             include: { paradas: true }
//         });

//         res.status(201).json({ mensaje: 'Pedido creado con éxito', pedido: newOrder });
//     } catch (error) {
//         // Log detallado para ver qué columna falla exactamente
//         console.error("Error detallado de Prisma:", error);
//         res.status(400).json({ error: 'Error al crear el pedido en la base de datos' });
//     }
// };


// export const getMyOrders = async (req: Request, res: Response) => {
//     // El ID lo sacamos del Token, igual que hicimos con la creación
//     const clienteId = (req as any).userId;

//     try {
//         const orders = await db.order.findMany({
//             where: {
//                 clienteId: clienteId
//             },
//             include: {
//                 paradas: true // Incluimos las paradas para que vea origen y destino
//             },
//             orderBy: {
//                 createdAt: 'desc' // Los más recientes primero
//             }
//         });

//         res.json(orders);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error al obtener tus pedidos' });
//     }
// };

// // 1. Ver pedidos disponibles para cualquier proveedor
// export const getAvailableOrders = async (req: Request, res: Response) => {
//     try {
//         const orders = await db.order.findMany({
//             where: {
//                 // 2. Usar el Enum en lugar de un string manual
//                 estado: OrderStatus.BUSCANDO
//             },
//             include: {
//                 paradas: true,
//                 cliente: { select: { nombre: true } }
//             }
//         });
//         res.json(orders);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al buscar fletes disponibles' });
//     }
// };

// export const acceptOrder = async (req: Request, res: Response) => {
//     // 3. Forzar que orderId sea tratado como string con "as string"
//     const orderId = req.params.orderId as string;
//     const proveedorId = (req as any).userId;

//     try {
//         const updatedOrder = await db.order.update({
//             where: { id: orderId },
//             data: {
//                 proveedorId: proveedorId,
//                 // 4. Usar el Enum aquí también
//                 estado: OrderStatus.ASIGNADO
//             }
//         });
//         res.json({ mensaje: '¡Pedido aceptado!', pedido: updatedOrder });
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ error: 'No se pudo aceptar el pedido' });
//     }
// };

// export const updateOrderStatus = async (req: Request, res: Response) => {
//     const orderId = req.params.orderId as string;
//     const { nuevoEstado } = req.body; // Recibimos el estado desde el body de Postman
//     const proveedorId = (req as any).userId;

//     try {
//         // Verificamos que el pedido pertenezca a este proveedor antes de cambiar el estado
//         const order = await db.order.findUnique({ where: { id: orderId } });

//         if (!order || order.proveedorId !== proveedorId) {
//             return res.status(403).json({ error: 'No tenés permiso para modificar este pedido.' });
//         }

//         const updatedOrder = await db.order.update({
//             where: { id: orderId },
//             data: { estado: nuevoEstado as OrderStatus }
//         });

//         res.json({
//             mensaje: `Estado actualizado a ${nuevoEstado}`,
//             pedido: updatedOrder
//         });
//     } catch (error) {
//         res.status(400).json({ error: 'Error al actualizar el estado.' });
//     }
// };



// export const getAdminStats = async (req: Request, res: Response) => {
//     try {
//         // 1. Agregamos sumas y conteos totales
//         const stats = await db.order.aggregate({
//             _sum: {
//                 precioTotal: true,
//                 comisionApp: true
//             },
//             _count: {
//                 id: true
//             }
//         });

//         // 2. Traemos solo los pedidos que ya están finalizados (ENTREGADO)
//         const pedidosFinalizados = await db.order.count({
//             where: { estado: 'ENTREGADO' }
//         });

//         // 3. Respuesta limpia para el frontend
//         res.json({
//             totalMovido: stats._sum.precioTotal || 0,
//             gananciaPlataforma: stats._sum.comisionApp || 0,
//             totalPedidos: stats._count.id,
//             pedidosCompletados: pedidosFinalizados
//         });
//     } catch (error) {
//         console.error("Error al generar KPIs:", error);
//         res.status(500).json({ error: 'Error al generar estadísticas' });
//     }
// };


// export const getPendingVehicles = async (req: Request, res: Response) => {
//     console.log("Ejecutando getPendingVehicles desde vehicleController.ts ✅");
//     try {
//         const vehicles = await db.vehicle.findMany({
//             where: { estado: "PENDIENTE" }, // ✅ solo los que esperan aprobación
//             include: {
//                 proveedor: {
//                     select: {
//                         id: true,
//                         nombre: true,
//                         email: true,
//                         telefono: true,
//                     }
//                 }
//             }
//         });

//         console.log("Vehículos completos:", JSON.stringify(vehicles, null, 2));
//         res.json(vehicles);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al obtener flota' });
//     }
// };

// export const updateVehicleStatus = async (req: Request, res: Response) => {
//     try {
//         const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//         const { accion } = req.body;

//         const nuevoEstado =
//             accion === 'APROBAR'
//                 ? "APROBADO"
//                 : accion === 'RECHAZAR'
//                     ? "RECHAZADO"
//                     : "PENDIENTE";


//         const vehicle = await db.vehicle.update({
//             where: { id },
//             data: {
//                 estado: nuevoEstado,
//                 fechaGestion: new Date(),
//             },
//         });

//         res.json({
//             mensaje: `Vehículo ${nuevoEstado.toLowerCase()}`,
//             vehicle,
//         });
//     } catch (error) {
//         console.error('Error en updateVehicleStatus:', error);
//         res.status(500).json({ error: 'Error al actualizar estado del vehículo' });
//     }
// };



// export const getProveedoresActivos = async (req: Request, res: Response) => {
//     try {
//         const proveedores = await db.user.findMany({
//             where: { rol: 'PROVEEDOR' },
//             include: { vehiculos: true }
//         });


//         res.json(proveedores);
//     } catch (error) {
//         console.error("Error detallado en getProveedoresActivos:", error);
//         res.status(500).json({ error: 'Error al obtener proveedores', detalle: error });
//     }
// };

import type { Request, Response } from 'express';
import db from '../db.js';
import { OrderStatus } from '@prisma/client';

// Crear pedido
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
        paradas: {
          create: paradas.map((p: any) => ({
            direccion: p.direccion,
            lat: p.lat,
            lng: p.lng,
            ordenVisita: p.ordenVisita,
            esEntrega: p.esEntrega
          }))
        }
      },
      include: { paradas: true }
    });
    res.status(201).json({ mensaje: 'Pedido creado con éxito', pedido: newOrder });
  } catch (error) {
    console.error("Error detallado de Prisma:", error);
    res.status(400).json({ error: 'Error al crear el pedido en la base de datos' });
  }
};

// Pedidos del cliente
export const getMyOrders = async (req: Request, res: Response) => {
  const clienteId = (req as any).userId;
  try {
    const orders = await db.order.findMany({
      where: { clienteId },
      include: { paradas: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tus pedidos' });
  }
};

// Pedidos disponibles
export const getAvailableOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await db.order.findMany({
      where: { estado: OrderStatus.BUSCANDO },
      include: { paradas: true, cliente: { select: { nombre: true } } }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar fletes disponibles' });
  }
};

// Aceptar pedido
export const acceptOrder = async (req: Request, res: Response) => {
  const orderId = req.params.orderId as string;
  const proveedorId = (req as any).userId;
  try {
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { proveedorId, estado: OrderStatus.ASIGNADO }
    });
    res.json({ mensaje: '¡Pedido aceptado!', pedido: updatedOrder });
  } catch (error) {
    res.status(400).json({ error: 'No se pudo aceptar el pedido' });
  }
};

// Actualizar estado
export const updateOrderStatus = async (req: Request, res: Response) => {
  const orderId = req.params.orderId as string;
  const { nuevoEstado } = req.body;
  const proveedorId = (req as any).userId;

  try {
    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order || order.proveedorId !== proveedorId) {
      return res.status(403).json({ error: 'No tenés permiso para modificar este pedido.' });
    }
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { estado: nuevoEstado as OrderStatus }
    });
    res.json({ mensaje: `Estado actualizado a ${nuevoEstado}`, pedido: updatedOrder });
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el estado.' });
  }
};

// Estadísticas admin
export const getAdminStats = async (_req: Request, res: Response) => {
  try {
    const stats = await db.order.aggregate({
      _sum: { precioTotal: true, comisionApp: true },
      _count: { id: true }
    });
    const pedidosFinalizados = await db.order.count({
      where: { estado: OrderStatus.ENTREGADO }
    });
    res.json({
      totalMovido: stats._sum.precioTotal || 0,
      gananciaPlataforma: stats._sum.comisionApp || 0,
      totalPedidos: stats._count.id,
      pedidosCompletados: pedidosFinalizados
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar estadísticas' });
  }
};
