# Carpeta: controllers

## Propósito
Contiene la lógica del backend para manejar las solicitudes HTTP.  
Cada controlador se encarga de un módulo específico del sistema.

## Archivos
- **authController.ts** → Login y registro de usuarios.
- **proveedorController.ts** → Gestión de proveedores y sus datos.
- **vehicleController.ts** → CRUD de vehículos y documentos asociados.
- **orderController.ts** → Manejo de pedidos y asignaciones.

## Relación con otras capas
- Se conecta con las rutas en `/routes/`.
- Interactúa con la base de datos a través de Prisma (`/prisma/schema.prisma`).
