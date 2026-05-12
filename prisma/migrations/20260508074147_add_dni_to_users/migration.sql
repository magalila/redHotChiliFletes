/*
  Warnings:

  - You are about to drop the `License` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[dni]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dni` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `capacidadVol` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `capacidadPeso` on table `Vehicle` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `tipo_vehiculo` on the `Vehicle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "DocType" ADD VALUE 'LICENCIA';

-- DropForeignKey
ALTER TABLE "License" DROP CONSTRAINT "License_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dni" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "capacidadVol" SET NOT NULL,
ALTER COLUMN "capacidadPeso" SET NOT NULL,
DROP COLUMN "tipo_vehiculo",
ADD COLUMN     "tipo_vehiculo" TEXT NOT NULL;

-- DropTable
DROP TABLE "License";

-- DropEnum
DROP TYPE "VehicleType";

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");
