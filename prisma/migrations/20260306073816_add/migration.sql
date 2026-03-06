-- CreateEnum
CREATE TYPE "typeOfNotify" AS ENUM ('Follow', 'Like_Post', 'Like_Comment', 'Like_reply', 'Post', 'Comment', 'Reply');

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "type" "typeOfNotify" NOT NULL,
    "message" TEXT,
    "is_checked" BOOLEAN NOT NULL DEFAULT false,
    "sender_id" INTEGER NOT NULL,
    "reciever_id" INTEGER NOT NULL,
    "post_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
