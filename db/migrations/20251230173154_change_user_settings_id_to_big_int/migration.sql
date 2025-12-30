/*
  Warnings:

  - The primary key for the `UserSettings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `UserSettings` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSettings" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "timezone" TEXT NOT NULL DEFAULT 'Etc/UTC',
    "dailyDmTime" TEXT NOT NULL DEFAULT '8AM'
);
INSERT INTO "new_UserSettings" ("dailyDmTime", "id", "timezone") SELECT "dailyDmTime", "id", "timezone" FROM "UserSettings";
DROP TABLE "UserSettings";
ALTER TABLE "new_UserSettings" RENAME TO "UserSettings";
CREATE UNIQUE INDEX "UserSettings_id_key" ON "UserSettings"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
