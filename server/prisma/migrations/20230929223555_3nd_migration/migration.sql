-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('Mandap', 'Master');

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255),
    "password" VARCHAR(255),
    "otp" TEXT,
    "role" "Role" NOT NULL DEFAULT E'user',
    "phone" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeltingFlowerIMGS" (
    "id" VARCHAR(255) NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "imageType" "ImageType" NOT NULL,
    "size" TEXT,
    "totalPrice" INTEGER NOT NULL,
    "flowerPrice" INTEGER NOT NULL,
    "otherPrice" INTEGER NOT NULL,

    CONSTRAINT "MeltingFlowerIMGS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllImages" (
    "id" VARCHAR(255) NOT NULL,
    "size" INTEGER,
    "imgCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageType" "ImageType" NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbTypes" (
    "id" VARCHAR(255) NOT NULL,
    "dbName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dbTypes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_id_email_phone_idx" ON "User"("id", "email", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "MeltingFlowerIMGS_id_key" ON "MeltingFlowerIMGS"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MeltingFlowerIMGS_code_key" ON "MeltingFlowerIMGS"("code");

-- CreateIndex
CREATE INDEX "MeltingFlowerIMGS_id_idx" ON "MeltingFlowerIMGS"("id");

-- CreateIndex
CREATE INDEX "MeltingFlowerIMGS_code_idx" ON "MeltingFlowerIMGS"("code");

-- CreateIndex
CREATE UNIQUE INDEX "AllImages_id_key" ON "AllImages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "AllImages_imgCode_key" ON "AllImages"("imgCode");

-- CreateIndex
CREATE UNIQUE INDEX "AllImages_name_key" ON "AllImages"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AllImages_path_key" ON "AllImages"("path");

-- CreateIndex
CREATE INDEX "AllImages_id_path_name_idx" ON "AllImages"("id", "path", "name");

-- CreateIndex
CREATE INDEX "AllImages_imgCode_idx" ON "AllImages"("imgCode");

-- CreateIndex
CREATE UNIQUE INDEX "dbTypes_id_key" ON "dbTypes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "dbTypes_dbName_key" ON "dbTypes"("dbName");

-- CreateIndex
CREATE INDEX "dbTypes_id_idx" ON "dbTypes"("id");

-- AddForeignKey
ALTER TABLE "AllImages" ADD CONSTRAINT "AllImages_imgCode_fkey" FOREIGN KEY ("imgCode") REFERENCES "MeltingFlowerIMGS"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
