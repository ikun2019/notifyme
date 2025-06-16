/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user"."Profile_userId_key" CASCADE;

-- AlterTable
ALTER TABLE "user"."Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId");
