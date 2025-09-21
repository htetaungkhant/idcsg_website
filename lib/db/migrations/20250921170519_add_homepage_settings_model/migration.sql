-- CreateTable
CREATE TABLE "public"."HomepageSettings" (
    "id" TEXT NOT NULL,
    "backgroundMediaUrl" TEXT,
    "backgroundMediaType" TEXT,
    "backgroundColor" TEXT,
    "backgroundOpacity" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomepageSettings_isActive_key" ON "public"."HomepageSettings"("isActive");
