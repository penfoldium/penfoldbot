-- CreateTable
CREATE TABLE "Reminders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "date" DATETIME NOT NULL,
    "message" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "triggered" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Reminders_id_key" ON "Reminders"("id");
