-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserSettings" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "timezone" TEXT NOT NULL DEFAULT 'Etc/UTC',
    "dailyDmTime" TEXT NOT NULL DEFAULT '8AM',
    "dailyDmEnabled" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_UserSettings" ("dailyDmTime", "id", "timezone") SELECT "dailyDmTime", "id", "timezone" FROM "UserSettings";
DROP TABLE "UserSettings";
ALTER TABLE "new_UserSettings" RENAME TO "UserSettings";
CREATE UNIQUE INDEX "UserSettings_id_key" ON "UserSettings"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
