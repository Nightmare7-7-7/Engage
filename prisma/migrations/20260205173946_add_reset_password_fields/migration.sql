-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reset_code_expiry" TIMESTAMP(3),
ADD COLUMN     "reset_code_hash" TEXT;
