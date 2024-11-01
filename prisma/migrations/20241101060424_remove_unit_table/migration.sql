/*
  Warnings:

  - You are about to drop the `ZakatUnit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `ZakatRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ZakatRecord" ADD COLUMN     "type" "UnitType" NOT NULL;

-- DropTable
DROP TABLE "ZakatUnit";
