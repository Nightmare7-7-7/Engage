-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Reply" (
    "id" SERIAL NOT NULL,
    "reply" TEXT NOT NULL,
    "replied_id" INTEGER NOT NULL,
    "replier_id" INTEGER NOT NULL,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_replied_id_fkey" FOREIGN KEY ("replied_id") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_replier_id_fkey" FOREIGN KEY ("replier_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
