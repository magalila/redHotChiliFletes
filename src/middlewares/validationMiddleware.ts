import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { ZodSchema } from 'zod';

export const validarEsquema = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Error de validación",
          detalles: error.issues.map(e => ({ 
            campo: e.path.join('.'), 
            mensaje: e.message 
          }))
        });
      }
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }