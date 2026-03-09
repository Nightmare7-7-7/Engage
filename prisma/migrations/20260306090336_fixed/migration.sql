/*
  Warnings:

  - The values [Post,Comment,Reply] on the enum `typeOfNotify` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "typeOfNotify_new" AS ENUM ('Follow', 'Like_Post', 'Like_Comment', 'Like_reply', 'comment', 'comment_reply', 'save');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "typeOfNotify_new" USING ("type"::text::"typeOfNotify_new");
ALTER TYPE "typeOfNotify" RENAME TO "typeOfNotify_old";
ALTER TYPE "typeOfNotify_new" RENAME TO "typeOfNotify";
DROP TYPE "public"."typeOfNotify_old";
COMMIT;
