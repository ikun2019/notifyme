-- CreateTable
CREATE TABLE "Thank" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Thank_pkey" PRIMARY KEY ("id")
);
