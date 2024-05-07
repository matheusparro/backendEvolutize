-- CreateTable
CREATE TABLE "User" (
    "_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "auth" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);
