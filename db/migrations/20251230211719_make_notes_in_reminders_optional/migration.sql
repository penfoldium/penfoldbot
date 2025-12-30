-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reminders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "date" DATETIME NOT NULL,
    "message" TEXT NOT NULL,
    "notes" TEXT,
    "triggered" BOOLEAN NOT NULL
);
INSERT INTO "new_Reminders" ("date", "id", "message", "notes", "triggered", "user_id") SELECT "date", "id", "message", "notes", "triggered", "user_id" FROM "Reminders";
DROP TABLE "Reminders";
ALTER TABLE "new_Reminders" RENAME TO "Reminders";
CREATE UNIQUE INDEX "Reminders_id_key" ON "Reminders"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
