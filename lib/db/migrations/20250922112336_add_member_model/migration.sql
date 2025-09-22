-- CreateEnum
CREATE TYPE "public"."TeamType" AS ENUM ('DOCTORS', 'CONSULTANT_SPECIALISTS', 'ALLIED_HEALTH_SUPPORT_STAFF');

-- CreateTable
CREATE TABLE "public"."members" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "team" "public"."TeamType" NOT NULL,
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);
