-- CreateTable
CREATE TABLE "public"."Safe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Safe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SafeSection1" (
    "id" TEXT NOT NULL,
    "safeId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "descriptionTitle" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafeSection1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SafeSection2" (
    "id" TEXT NOT NULL,
    "safeId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "descriptionTitle" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafeSection2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SafeSection3" (
    "id" TEXT NOT NULL,
    "safeId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "descriptionTitle" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafeSection3_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SafeSection1_safeId_key" ON "public"."SafeSection1"("safeId");

-- CreateIndex
CREATE UNIQUE INDEX "SafeSection2_safeId_key" ON "public"."SafeSection2"("safeId");

-- CreateIndex
CREATE UNIQUE INDEX "SafeSection3_safeId_key" ON "public"."SafeSection3"("safeId");

-- AddForeignKey
ALTER TABLE "public"."SafeSection1" ADD CONSTRAINT "SafeSection1_safeId_fkey" FOREIGN KEY ("safeId") REFERENCES "public"."Safe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SafeSection2" ADD CONSTRAINT "SafeSection2_safeId_fkey" FOREIGN KEY ("safeId") REFERENCES "public"."Safe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SafeSection3" ADD CONSTRAINT "SafeSection3_safeId_fkey" FOREIGN KEY ("safeId") REFERENCES "public"."Safe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
