-- CreateTable
CREATE TABLE "UserSettings" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "timezone" TEXT NOT NULL DEFAULT 'Etc/UTC',
    "dailyDmTime" TEXT NOT NULL DEFAULT '8:00',
    "dailyDmEnabled" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Reminders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "channel_id" BIGINT,
    "locale" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "message" TEXT NOT NULL,
    "triggered" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Todos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "todo" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "Notes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "note" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_id_key" ON "UserSettings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Reminders_id_key" ON "Reminders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Todos_id_key" ON "Todos"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Notes_id_key" ON "Notes"("id");
