-- CreateEnum
CREATE TYPE "EstadoVehiculo" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "estado" "EstadoVehiculo" NOT NULL DEFAULT 'PENDIENTE';
