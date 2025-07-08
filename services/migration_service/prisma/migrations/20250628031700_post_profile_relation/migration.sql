-- AddForeignKey
ALTER TABLE "post"."Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"."Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
