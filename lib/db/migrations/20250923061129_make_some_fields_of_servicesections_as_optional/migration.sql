-- AlterTable
ALTER TABLE "public"."ServiceSection1" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ServiceSection3" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ServiceSection4" ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ServiceSection4Card" ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ServiceSection5" ALTER COLUMN "title" DROP NOT NULL;
