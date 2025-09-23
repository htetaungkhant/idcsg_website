-- CreateEnum
CREATE TYPE "public"."PreciseCardStyle" AS ENUM ('CARDSTYLE1', 'CARDSTYLE2', 'CARDSTYLE3');

-- CreateTable
CREATE TABLE "public"."Precise" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Precise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PreciseSection" (
    "id" TEXT NOT NULL,
    "preciseId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "descriptionTitle" TEXT,
    "description" TEXT,
    "cardStyle" "public"."PreciseCardStyle" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreciseSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PreciseSection" ADD CONSTRAINT "PreciseSection_preciseId_fkey" FOREIGN KEY ("preciseId") REFERENCES "public"."Precise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
