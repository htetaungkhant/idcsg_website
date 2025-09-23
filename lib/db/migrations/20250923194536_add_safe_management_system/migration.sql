/*
  Warnings:

  - You are about to drop the `SafeSection1` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SafeSection2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SafeSection3` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."SafeCardStyle" AS ENUM ('CARDSTYLE1', 'CARDSTYLE2', 'CARDSTYLE3');

-- DropForeignKey
ALTER TABLE "public"."SafeSection1" DROP CONSTRAINT "SafeSection1_safeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SafeSection2" DROP CONSTRAINT "SafeSection2_safeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SafeSection3" DROP CONSTRAINT "SafeSection3_safeId_fkey";

-- DropTable
DROP TABLE "public"."SafeSection1";

-- DropTable
DROP TABLE "public"."SafeSection2";

-- DropTable
DROP TABLE "public"."SafeSection3";

-- CreateTable
CREATE TABLE "public"."SafeSection" (
    "id" TEXT NOT NULL,
    "safeId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "descriptionTitle" TEXT,
    "description" TEXT,
    "cardStyle" "public"."SafeCardStyle" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafeSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."SafeSection" ADD CONSTRAINT "SafeSection_safeId_fkey" FOREIGN KEY ("safeId") REFERENCES "public"."Safe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
