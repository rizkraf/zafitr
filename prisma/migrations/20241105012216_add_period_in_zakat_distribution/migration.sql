/*
  Warnings:

  - Added the required column `zakatPeriod` to the `ZakatDistribution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ZakatDistribution" ADD COLUMN     "zakatPeriod" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ZakatDistribution" ADD CONSTRAINT "ZakatDistribution_zakatPeriod_fkey" FOREIGN KEY ("zakatPeriod") REFERENCES "ZakatPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
