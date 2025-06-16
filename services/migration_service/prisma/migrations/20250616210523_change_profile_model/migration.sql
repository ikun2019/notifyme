-- AddForeignKey
ALTER TABLE "user"."UserFollowedTag" ADD CONSTRAINT "UserFollowedTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"."Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
