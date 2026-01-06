/*
  Warnings:

  - Added the required column `locale` to the `Reminders` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reminders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "channel_id" BIGINT,
    "locale" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "message" TEXT NOT NULL,
    "triggered" BOOLEAN NOT NULL
);
INSERT INTO "new_Reminders" ("channel_id", "date", "id", "message", "triggered", "user_id") SELECT "channel_id", "date", "id", "message", "triggered", "user_id" FROM "Reminders";
DROP TABLE "Reminders";
ALTER TABLE "new_Reminders" RENAME TO "Reminders";
CREATE UNIQUE INDEX "Reminders_id_key" ON "Reminders"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
