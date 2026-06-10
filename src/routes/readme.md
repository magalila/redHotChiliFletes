# Carpeta: routes

## Propósito
Define las rutas del servidor Express y conecta cada endpoint con su controlador correspondiente.

## Archivos
- **authRoutes.ts** → Rutas de autenticación (login, registro).
- **proveedorRoutes.ts** → Rutas del proveedor (perfil, móviles, documentos).
- **vehicleRoutes.ts** → Rutas de vehículos.
- **orderRoutes.ts** → Rutas de pedidos.

## Convención
Cada archivo exporta un `Router` de Express y se registra en `app.ts`.
