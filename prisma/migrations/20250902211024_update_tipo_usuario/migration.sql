/*
  Warnings:

  - The values [COMUM] on the enum `TipoUsuario` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."TipoUsuario_new" AS ENUM ('ADMIN', 'MEMBRO');
ALTER TABLE "public"."Usuario" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."Usuario" ALTER COLUMN "role" TYPE "public"."TipoUsuario_new" USING ("role"::text::"public"."TipoUsuario_new");
ALTER TYPE "public"."TipoUsuario" RENAME TO "TipoUsuario_old";
ALTER TYPE "public"."TipoUsuario_new" RENAME TO "TipoUsuario";
DROP TYPE "public"."TipoUsuario_old";
ALTER TABLE "public"."Usuario" ALTER COLUMN "role" SET DEFAULT 'MEMBRO';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Usuario" ALTER COLUMN "role" SET DEFAULT 'MEMBRO';
