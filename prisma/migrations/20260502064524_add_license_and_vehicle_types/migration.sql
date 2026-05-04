/*
  Warnings:

  - The values [LICENCIA] on the enum `DocType` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `tipo_vehiculo` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOTO', 'FLETE', 'CAMIONETA');

-- AlterEnum
BEGIN;
CREATE TYPE "DocType_new" AS ENUM ('SEGURO', 'VTV', 'CEDULA');
ALTER TABLE "VehicleDocument" ALTER COLUMN "tipo" TYPE "DocType_new" USING ("tipo"::text::"DocType_new");
ALTER TYPE "DocType" RENAME TO "DocType_old";
ALTER TYPE "DocType_new" RENAME TO "DocType";
DROP TYPE "public"."DocType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "tipo_vehiculo",
ADD COLUMN     "tipo_vehiculo" "VehicleType" NOT NULL,
ALTER COLUMN "capacidadVol" DROP NOT NULL,
ALTER COLUMN "capacidadPeso" DROP NOT NULL;

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "nroLicencia" TEXT NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "estado" "DocStatus" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "License_userId_key" ON "License"("userId");

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
