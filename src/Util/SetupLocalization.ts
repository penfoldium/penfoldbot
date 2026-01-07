import i18next from "i18next";
import FsBackend from "i18next-fs-backend";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const languages = readdirSync(`${import.meta.dirname}/../Locales/`).filter(path =>
  statSync(join(`${import.meta.dirname}/../Locales/`, path)).isDirectory()
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
    loadPath: `${import.meta.dirname}/../Locales/{{lng}}/{{ns}}.json`
  }
});
await i18next.loadLanguages(languages);
// Re-assign i18next.languages to have all the languages, not just 1-2
i18next.languages = languages;

import clientNs from "../Locales/en-US/client.json" with { type: "json" };
import commandsNs from "../Locales/en-US/commands.json" with { type: "json" };
import errorsNs from "../Locales/en-US/errors.json" with { type: "json" };
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
