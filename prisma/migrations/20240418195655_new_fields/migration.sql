/*
  Warnings:

  - You are about to drop the column `vapid_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `auth` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endpoint` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `p256dh` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "auth" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "name") SELECT "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
