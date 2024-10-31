/*
  Warnings:

  - Added the required column `unit` to the `ZakatUnit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ZakatUnit" ADD COLUMN     "unit" TEXT NOT NULL;
