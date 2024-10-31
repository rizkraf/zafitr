/*
  Warnings:

  - You are about to drop the column `amount` on the `ZakatUnit` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `ZakatUnit` table. All the data in the column will be lost.
  - Added the required column `conversionRate` to the `ZakatUnit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ZakatUnit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('MAKANAN', 'UANG');

-- AlterTable
ALTER TABLE "ZakatUnit" DROP COLUMN "amount",
DROP COLUMN "unit",
ADD COLUMN     "conversionRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "type" "UnitType" NOT NULL;
