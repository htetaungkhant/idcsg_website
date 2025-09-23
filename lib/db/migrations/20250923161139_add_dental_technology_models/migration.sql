-- CreateTable
CREATE TABLE "public"."DentalTechnology" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DentalTechnology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DentalTechnologySection1" (
    "id" TEXT NOT NULL,
    "dentalTechnologyId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DentalTechnologySection1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DentalTechnologyCard1" (
    "id" TEXT NOT NULL,
    "dentalTechnologyId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DentalTechnologyCard1_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DentalTechnologyCard2" (
    "id" TEXT NOT NULL,
    "dentalTechnologyId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DentalTechnologyCard2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DentalTechnologySection1_dentalTechnologyId_key" ON "public"."DentalTechnologySection1"("dentalTechnologyId");

-- CreateIndex
CREATE UNIQUE INDEX "DentalTechnologyCard1_dentalTechnologyId_key" ON "public"."DentalTechnologyCard1"("dentalTechnologyId");

-- CreateIndex
CREATE UNIQUE INDEX "DentalTechnologyCard2_dentalTechnologyId_key" ON "public"."DentalTechnologyCard2"("dentalTechnologyId");

-- AddForeignKey
ALTER TABLE "public"."DentalTechnologySection1" ADD CONSTRAINT "DentalTechnologySection1_dentalTechnologyId_fkey" FOREIGN KEY ("dentalTechnologyId") REFERENCES "public"."DentalTechnology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DentalTechnologyCard1" ADD CONSTRAINT "DentalTechnologyCard1_dentalTechnologyId_fkey" FOREIGN KEY ("dentalTechnologyId") REFERENCES "public"."DentalTechnology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DentalTechnologyCard2" ADD CONSTRAINT "DentalTechnologyCard2_dentalTechnologyId_fkey" FOREIGN KEY ("dentalTechnologyId") REFERENCES "public"."DentalTechnology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
