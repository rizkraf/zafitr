/*
  Warnings:

  - Added the required column `mustahikCategoryId` to the `Mustahik` table without a default value. This is not possible if the table is not empty.
  - Added the required column `muzakkiCategoryId` to the `Muzakki` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zakatPeriod` to the `ZakatRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mustahik" ADD COLUMN     "mustahikCategoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Muzakki" ADD COLUMN     "muzakkiCategoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ZakatRecord" ADD COLUMN     "zakatPeriod" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MuzakkiCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MuzakkiCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MustahikCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MustahikCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZakatPeriod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZakatPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZakatUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZakatUnit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Muzakki" ADD CONSTRAINT "Muzakki_muzakkiCategoryId_fkey" FOREIGN KEY ("muzakkiCategoryId") REFERENCES "MuzakkiCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mustahik" ADD CONSTRAINT "Mustahik_mustahikCategoryId_fkey" FOREIGN KEY ("mustahikCategoryId") REFERENCES "MustahikCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZakatRecord" ADD CONSTRAINT "ZakatRecord_zakatPeriod_fkey" FOREIGN KEY ("zakatPeriod") REFERENCES "ZakatPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
