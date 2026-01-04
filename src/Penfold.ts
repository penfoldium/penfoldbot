// #region Initialize Dayjs
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
// #endregion

// #region Initialize i18n for localizations
import i18next from "i18next";
import FsBackend from "i18next-fs-backend";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const languages = readdirSync(`${import.meta.dirname}/Locales/`).filter(path =>
  statSync(join(`${import.meta.dirname}/Locales/`, path)).isDirectory()
);

await i18next.use(FsBackend).init({
  saveMissing: true,
  missingKeyHandler: (_, __, key) => {
    console.warn(`[i18next] Key ${key} doesn't exist in locales`);
  },
  lng: process.env["LANGUAGE"] ?? "en-US",
  fallbackLng: "en-US",
  ns: ["client", "errors", "commands"],
  defaultNS: "commands",
  interpolation: {
    escapeValue: false
  },
  backend: {
    loadPath: `${import.meta.dirname}/Locales/{{lng}}/{{ns}}.json`
  }
});
await i18next.loadLanguages(languages);
// Re-assign i18next.languages to have all the languages, not just 1-2
i18next.languages = languages;
// #endregion

// #region Initialize the bot
import { GatewayIntentBits } from "discord.js";
import { PenfoldClient } from "./Classes/PenfoldClient.js";

if (!process.env["DATABASE_URL"])
  throw new Error(i18next.t("POPULATE_DATABASE_URL", { ns: "errors" }));

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
// #endregion

// #region Enable intelisense for i18n
import clientNs from "./Locales/en-US/client.json" with { type: "json" };
import commandsNs from "./Locales/en-US/commands.json" with { type: "json" };
import errorsNs from "./Locales/en-US/errors.json" with { type: "json" };

declare module "i18next" {
  export interface CustomTypeOptions {
    defaultNS: "commands";
    resources: {
      client: typeof clientNs;
      commands: typeof commandsNs;
      errors: typeof errorsNs;
    };
  }
}
// #endregion
