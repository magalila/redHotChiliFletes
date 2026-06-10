# Carpeta: views

## Propósito
Contiene vistas renderizadas desde el backend (si se usan plantillas o SSR).  
Se diferencia de `frontend-proveedor` porque estas vistas pueden ser dinámicas.

## Archivos
- **admin/** → Vistas del panel de administración.
- **proveedor-backend/** → Vistas del proveedor generadas desde el servidor.

## Relación con otras capas
- Se renderizan desde controladores usando motores de plantillas (ej. EJS, Pug).
