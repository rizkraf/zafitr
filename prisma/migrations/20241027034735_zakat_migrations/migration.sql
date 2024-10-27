-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'PETUGAS');

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "password" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PETUGAS',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Muzzaki" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Muzzaki_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mustahik" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mustahik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZakatRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "muzzakiId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dateReceived" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZakatRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZakatDistribution" (
    "id" TEXT NOT NULL,
    "mustahikId" TEXT NOT NULL,
    "zakatRecordId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dateDistribution" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZakatDistribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZakatRecord" ADD CONSTRAINT "ZakatRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZakatRecord" ADD CONSTRAINT "ZakatRecord_muzzakiId_fkey" FOREIGN KEY ("muzzakiId") REFERENCES "Muzzaki"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZakatDistribution" ADD CONSTRAINT "ZakatDistribution_mustahikId_fkey" FOREIGN KEY ("mustahikId") REFERENCES "Mustahik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZakatDistribution" ADD CONSTRAINT "ZakatDistribution_zakatRecordId_fkey" FOREIGN KEY ("zakatRecordId") REFERENCES "ZakatRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
