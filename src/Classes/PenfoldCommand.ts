import { SlashCommandBuilder, type Interaction } from "discord.js";
import { PenfoldBase, type BaseOptions } from "./PenfoldBase.js";
import { type PenfoldClient } from "./PenfoldClient.js";

export abstract class PenfoldCommand extends PenfoldBase {
  builder: SlashCommandBuilder;
  description: string;
  ownerOnly?: boolean;

  constructor(client: PenfoldClient, options: CommandOptions) {
    super(client, options);
    this.description = options.description ?? "No description provided.";
    this.ownerOnly = options.ownerOnly ?? false;

    this.builder = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description);
  }

  abstract override run(interaction: Interaction): any;
}

export type CommandOptions = BaseOptions & {
  description?: string;
  ownerOnly?: boolean;
};
