/*
  Warnings:

  - A unique constraint covering the columns `[transactionNumber]` on the table `ZakatDistribution` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionNumber` to the `ZakatDistribution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ZakatDistribution" ADD COLUMN     "transactionNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ZakatDistribution_transactionNumber_key" ON "ZakatDistribution"("transactionNumber");
