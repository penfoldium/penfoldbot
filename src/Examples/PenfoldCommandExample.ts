import type { ChatInputCommandInteraction } from "discord.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../Classes/PenfoldCommand.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      // Must be keys in localization
      name: "command.name",
      description: "command.description"
    });
  }

  public run(_interaction: ChatInputCommandInteraction) {}
}
