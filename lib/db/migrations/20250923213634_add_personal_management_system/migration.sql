-- CreateEnum
CREATE TYPE "public"."PersonalCardStyle" AS ENUM ('CARDSTYLE1', 'CARDSTYLE2', 'CARDSTYLE3');

-- CreateTable
CREATE TABLE "public"."Personal" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Personal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PersonalSection" (
    "id" TEXT NOT NULL,
    "personalId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "descriptionTitle" TEXT,
    "description" TEXT,
    "cardStyle" "public"."PersonalCardStyle" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PersonalSection" ADD CONSTRAINT "PersonalSection_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "public"."Personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
