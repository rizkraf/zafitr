/*
  Warnings:

  - You are about to drop the column `muzzakiId` on the `ZakatRecord` table. All the data in the column will be lost.
  - You are about to drop the `Muzzaki` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `muzakkiId` to the `ZakatRecord` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ZakatRecord" DROP CONSTRAINT "ZakatRecord_muzzakiId_fkey";

-- AlterTable
ALTER TABLE "ZakatRecord" DROP COLUMN "muzzakiId",
ADD COLUMN     "muzakkiId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Muzzaki";

-- CreateTable
CREATE TABLE "Muzakki" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Muzakki_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ZakatRecord" ADD CONSTRAINT "ZakatRecord_muzakkiId_fkey" FOREIGN KEY ("muzakkiId") REFERENCES "Muzakki"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
