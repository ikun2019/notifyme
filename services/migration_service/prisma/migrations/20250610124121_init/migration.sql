-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "post";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "tag";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "thank";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user";

-- CreateTable
CREATE TABLE "post"."Post" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post"."PostTag" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId","tagId")
);

-- CreateTable
CREATE TABLE "tag"."Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thank"."Thank" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Thank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatar_url" TEXT,
    "post_count" INTEGER NOT NULL DEFAULT 0,
    "thanks_received" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."UserFollowedTag" (
    "profileId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "UserFollowedTag_pkey" PRIMARY KEY ("profileId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "user"."Profile"("userId");

-- AddForeignKey
ALTER TABLE "post"."PostTag" ADD CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post"."PostTag" ADD CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."UserFollowedTag" ADD CONSTRAINT "UserFollowedTag_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "user"."Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."UserFollowedTag" ADD CONSTRAINT "UserFollowedTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tag"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
