/*
  Warnings:

  - You are about to drop the column `imgCode` on the `AllImages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `AllImages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `AllImages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AllImages" DROP CONSTRAINT "AllImages_imgCode_fkey";

-- DropIndex
DROP INDEX "AllImages_imgCode_idx";

-- DropIndex
DROP INDEX "AllImages_imgCode_key";

-- AlterTable
ALTER TABLE "AllImages" DROP COLUMN "imgCode",
ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AllImages_code_key" ON "AllImages"("code");

-- CreateIndex
CREATE INDEX "AllImages_code_idx" ON "AllImages"("code");
