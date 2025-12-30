-- CreateTable
CREATE TABLE "UserSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "timezone" TEXT NOT NULL DEFAULT 'Etc/UTC',
    "dailyDmTime" TEXT NOT NULL DEFAULT '8AM'
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_id_key" ON "UserSettings"("id");
