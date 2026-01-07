import "./Util/SetupDayjs.js";
import "./Util/SetupLocalization.js";

import { GatewayIntentBits } from "discord.js";
import i18next from "i18next";
import { PenfoldClient } from "./Classes/PenfoldClient.js";

if (!process.env["DATABASE_URL"])
  throw new Error(i18next.t("POPULATE_DATABASE_URL", { ns: "errors" }));

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../db/prisma/client.js";

const adapter = new PrismaBetterSqlite3({ url: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

const client = new PenfoldClient({
  intents: [GatewayIntentBits.Guilds],
  db: prisma
});

await client.loadAll();
await client.login(process.env["TOKEN"]);
