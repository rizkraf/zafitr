/*
  Warnings:

  - A unique constraint covering the columns `[transactionNumber]` on the table `ZakatRecord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionNumber` to the `ZakatRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ZakatRecord" ADD COLUMN     "transactionNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ZakatRecord_transactionNumber_key" ON "ZakatRecord"("transactionNumber");
