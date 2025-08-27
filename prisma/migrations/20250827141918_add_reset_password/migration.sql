-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
