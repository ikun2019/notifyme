/*
  Warnings:

  - The primary key for the `UserFollowedTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `profileId` on the `UserFollowedTag` table. All the data in the column will be lost.
  - Added the required column `userId` to the `UserFollowedTag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user"."UserFollowedTag" DROP CONSTRAINT "UserFollowedTag_profileId_fkey";

-- AlterTable
ALTER TABLE "user"."UserFollowedTag" DROP CONSTRAINT "UserFollowedTag_pkey",
DROP COLUMN "profileId",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "UserFollowedTag_pkey" PRIMARY KEY ("userId", "tagId");

-- AddForeignKey
ALTER TABLE "user"."UserFollowedTag" ADD CONSTRAINT "UserFollowedTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"."Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
