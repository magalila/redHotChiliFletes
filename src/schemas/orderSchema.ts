// import { z } from 'zod';

// export const createOrderSchema = z.object({
//   // Usamos 'message' que es lo que TypeScript explícitamente dice aceptar en el error
//   tipo: z.enum(['FLETE', 'MUDANZA'], {
//     message: "El tipo debe ser FLETE o MUDANZA"
//   }),
//   distanciaTotal: z.number().positive("La distancia debe ser mayor a 0"),
//   precioTotal: z.number().min(500, "El precio mínimo es de 500"),
//   paradas: z.array(
//     z.object({
//       direccion: z.string().min(5, "La dirección es muy corta"),
//       tipo: z.enum(['ORIGEN', 'DESTINO', 'INTERMEDIA'], {
//         message: "El tipo de parada no es válido"
//       }),
//       orden: z.number().int()
//     })
//   ).min(2, "Se requieren al menos 2 paradas (Origen y Destino)")
// });


// src/schemas/orderSchema.ts
import { z } from 'zod';

export const createOrderSchema = z.object({
  tipo: z.enum(['FLETE', 'MANDADO'], { // Actualizado a tus Enums de Prisma
    message: "El tipo debe ser FLETE o MANDADO"
  }),
  distanciaTotal: z.number().positive("La distancia debe ser mayor a 0"),
  precioTotal: z.number().min(500, "El precio mínimo es de 500"),
  paradas: z.array(
    z.object({
      direccion: z.string().min(5, "La dirección es muy corta"),
      lat: z.number(),
      lng: z.number(),
      // Cambiamos 'orden' por 'ordenVisita' para que coincida con Prisma
      ordenVisita: z.number().int("El orden debe ser un número entero"),
      // Cambiamos 'tipo' por 'esEntrega' que es un booleano
     esEntrega: z.boolean({
        message: "Debes indicar si es una entrega o no"
      })
    })
  ).min(2, "Se requieren al menos 2 paradas (Origen y Destino)")
});