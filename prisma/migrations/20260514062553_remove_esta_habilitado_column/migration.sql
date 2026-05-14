/*
  Warnings:

  - You are about to drop the column `estaHabilitado` on the `Vehicle` table. All the data in the column will be lost.
  - The `estado` column on the `Vehicle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "estaHabilitado",
DROP COLUMN "estado",
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'PENDIENTE';
