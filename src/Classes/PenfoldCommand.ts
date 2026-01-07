import {
  AutocompleteInteraction,
  Collection,
  SlashCommandBuilder,
  type Interaction
} from "discord.js";
import type { CustomTypeOptions } from "i18next";
import { getEnglishLocale } from "../Util/Helpers.js";
import { PenfoldBase } from "./PenfoldBase.js";
import { type PenfoldClient } from "./PenfoldClient.js";
import { PenfoldSlashCommandBuilder } from "./PenfoldSlashCommandBuilders.js";

export abstract class PenfoldCommand extends PenfoldBase {
  builder: SlashCommandBuilder;
  description: string;
  ownerOnly?: boolean;
  cooldown: number;
  #cooldowns = new Collection<string, Date>();

  constructor(client: PenfoldClient, options: CommandOptions) {
    super(client, options);
    this.name = getEnglishLocale(options.name);
    this.description = getEnglishLocale(options.description);
    this.ownerOnly = options.ownerOnly ?? false;
    this.cooldown = options.cooldown ?? 5;

    this.builder = new PenfoldSlashCommandBuilder()
      .localizeName(options.name)
      .localizeDescription(options.description);
  }

  abstract override run(interaction: Interaction): unknown;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async autocomplete(_interaction: AutocompleteInteraction) {
    throw new Error("Function not implemented.");
  }

  addCooldown(user: string, until: Date) {
    this.#cooldowns.set(user, until);
  }

  getCooldown(user: string) {
    return this.#cooldowns.get(user);
  }

  hasCooldown(user: string) {
    return this.#cooldowns.has(user);
  }

  removeCooldown(user: string) {
    this.#cooldowns.delete(user);
  }
}

export type CommandOptions = {
  name: keyof CustomTypeOptions["resources"]["commands"];
  description: keyof CustomTypeOptions["resources"]["commands"];
  ownerOnly?: boolean;
  cooldown?: number;
};
