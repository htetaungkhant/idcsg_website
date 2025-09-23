-- CreateTable
CREATE TABLE "public"."FirstVisit" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FirstVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FirstVisitSection" (
    "id" TEXT NOT NULL,
    "firstVisitId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "title" TEXT,
    "descriptionTitle" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FirstVisitSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FirstVisitVideoSection" (
    "id" TEXT NOT NULL,
    "firstVisitId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FirstVisitVideoSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FirstVisitInformationSection" (
    "id" TEXT NOT NULL,
    "firstVisitId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "descriptionTitle" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FirstVisitInformationSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FirstVisitVideoSection_firstVisitId_key" ON "public"."FirstVisitVideoSection"("firstVisitId");

-- CreateIndex
CREATE UNIQUE INDEX "FirstVisitInformationSection_firstVisitId_key" ON "public"."FirstVisitInformationSection"("firstVisitId");

-- AddForeignKey
ALTER TABLE "public"."FirstVisitSection" ADD CONSTRAINT "FirstVisitSection_firstVisitId_fkey" FOREIGN KEY ("firstVisitId") REFERENCES "public"."FirstVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FirstVisitVideoSection" ADD CONSTRAINT "FirstVisitVideoSection_firstVisitId_fkey" FOREIGN KEY ("firstVisitId") REFERENCES "public"."FirstVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FirstVisitInformationSection" ADD CONSTRAINT "FirstVisitInformationSection_firstVisitId_fkey" FOREIGN KEY ("firstVisitId") REFERENCES "public"."FirstVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
