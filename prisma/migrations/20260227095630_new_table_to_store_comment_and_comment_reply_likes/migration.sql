/*
  Warnings:

  - You are about to drop the column `likes` on the `Comment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "typeof_like" AS ENUM ('Comment', 'Reply');

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "likes";

-- CreateTable
CREATE TABLE "CmtOrReplyLike" (
    "id" SERIAL NOT NULL,
    "like_type" "typeof_like" NOT NULL,
    "liker_id" INTEGER NOT NULL,
    "comment_id" INTEGER,
    "reply_id" INTEGER,

    CONSTRAINT "CmtOrReplyLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CmtOrReplyLike_liker_id_comment_id_key" ON "CmtOrReplyLike"("liker_id", "comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "CmtOrReplyLike_liker_id_reply_id_key" ON "CmtOrReplyLike"("liker_id", "reply_id");

-- AddForeignKey
ALTER TABLE "CmtOrReplyLike" ADD CONSTRAINT "CmtOrReplyLike_liker_id_fkey" FOREIGN KEY ("liker_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmtOrReplyLike" ADD CONSTRAINT "CmtOrReplyLike_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmtOrReplyLike" ADD CONSTRAINT "CmtOrReplyLike_reply_id_fkey" FOREIGN KEY ("reply_id") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
