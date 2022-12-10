import { BucketScope, SapphireClient } from "@sapphire/framework";
import "@sapphire/plugin-subcommands/register";
import { ColorResolvable } from "discord.js";
import * as configJson from "./data/config.json";

// We use Object.assign to be able to re-assign properties
const config: Config = Object.assign({}, configJson);
if (!config.embedHex) config.embedHex = "#2e7da4";

const client = new SapphireClient({
  intents: ["GUILDS", "GUILD_MESSAGES"],
  defaultCooldown: {
    delay: 10_000,
    filteredCommands: ["ping"],
    scope: BucketScope.User,
  },
  config,
});

// TODO(Alex): Implement Top.GG sdk

client.login(config.token);

export interface Config {
  token: string;
  serverInvite?: string;
  embedHex: string;
  youtubeApi?: string;
}

declare module "discord.js" {
  export interface ClientOptions {
    config: Config;
  }
}
