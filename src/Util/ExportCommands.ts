import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { GatewayIntentBits } from "discord.js";
import { PrismaClient } from "../../db/prisma/client.js";
import { PenfoldClient } from "../Classes/PenfoldClient.js";

import { writeFile } from "node:fs/promises";
import "./SetupLocalization.js";

const client = new PenfoldClient({
  intents: GatewayIntentBits.Guilds,
  db: new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: ":memory:" }) })
});

await client.loadCommands();
const json = client.commands
  .filter(command => !command.ownerOnly)
  .map(command => command.builder.toJSON());
await writeFile("./commands.json", JSON.stringify(json));
