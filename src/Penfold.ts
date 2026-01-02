import { GatewayIntentBits } from "discord.js";
import { PenfoldClient } from "./Classes/PenfoldClient.js";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

if (!process.env["DATABASE_URL"]) throw new Error("Please populate the DATABASE_URL env variable.");

const adapter = new PrismaBetterSqlite3({ url: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../db/prisma/client.js";

const client = new PenfoldClient({
  intents: [GatewayIntentBits.Guilds],
  db: prisma
});

await client.loadAll();
await client.login(process.env["TOKEN"]);
