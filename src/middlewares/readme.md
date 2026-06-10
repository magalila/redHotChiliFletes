# Carpeta: middlewares

## Propósito
Contiene funciones intermedias que se ejecutan antes de llegar al controlador.  
Sirven para validar, autenticar y proteger las rutas.

## Archivos
- **authMiddleware.ts** → Verifica tokens JWT y roles de usuario.
- **validationMiddleware.ts** → Valida datos de entrada antes de procesarlos.

## Relación con otras capas
- Se usan en las rutas (`/routes/`) para proteger endpoints.
