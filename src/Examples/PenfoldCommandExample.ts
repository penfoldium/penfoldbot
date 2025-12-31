import type { ChatInputCommandInteraction } from "discord.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../Classes/PenfoldCommand.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      // Complicated way to use filename as command name (works on both windows and linux) - recommended to explicitly set it
      name: import.meta.filename.split(".").slice(-2)[0]!.split("\\").pop()!.split("/").pop()!,
      description: "No description provided"
    });
  }

  public run(_interaction: ChatInputCommandInteraction) {}
}
