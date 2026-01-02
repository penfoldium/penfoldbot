-- CreateTable
CREATE TABLE "Notes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" BIGINT NOT NULL,
    "note" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Notes_id_key" ON "Notes"("id");
