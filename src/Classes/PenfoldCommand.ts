import {
  AutocompleteInteraction,
  Collection,
  SlashCommandBuilder,
  type Interaction
} from "discord.js";
import { PenfoldBase, type BaseOptions } from "./PenfoldBase.js";
import { type PenfoldClient } from "./PenfoldClient.js";

export abstract class PenfoldCommand extends PenfoldBase {
  builder: SlashCommandBuilder;
  description: string;
  ownerOnly?: boolean;
  cooldown: number;
  #cooldowns = new Collection<string, Date>();

  constructor(client: PenfoldClient, options: CommandOptions) {
    super(client, options);
    this.description = options.description ?? "No description provided.";
    this.ownerOnly = options.ownerOnly ?? false;
    this.cooldown = options.cooldown ?? 5;

    this.builder = new SlashCommandBuilder().setName(this.name).setDescription(this.description);
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

export type CommandOptions = BaseOptions & {
  description?: string;
  ownerOnly?: boolean;
  cooldown?: number;
};
