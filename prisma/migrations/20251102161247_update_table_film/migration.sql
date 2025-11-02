/*
  Warnings:

  - Added the required column `emEstoque` to the `Filmes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preco` to the `Filmes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Filmes" ADD COLUMN     "emEstoque" BOOLEAN NOT NULL,
ADD COLUMN     "preco" DOUBLE PRECISION NOT NULL;
