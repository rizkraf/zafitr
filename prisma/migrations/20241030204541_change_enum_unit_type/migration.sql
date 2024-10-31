/*
  Warnings:

  - The values [MAKANAN] on the enum `UnitType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UnitType_new" AS ENUM ('BERAS', 'UANG');
ALTER TABLE "ZakatUnit" ALTER COLUMN "type" TYPE "UnitType_new" USING ("type"::text::"UnitType_new");
ALTER TYPE "UnitType" RENAME TO "UnitType_old";
ALTER TYPE "UnitType_new" RENAME TO "UnitType";
DROP TYPE "UnitType_old";
COMMIT;
