import type { ChatInputCommandInteraction } from "discord.js";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "ping",
      description:
        "Test the time it takes for you to send a message on Discord and when it arrives to Penfold's server",
    });
  }

  public async run(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Ping?");
    const reply = await interaction.fetchReply();
    const time = reply.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply(`🏓 Pong! Took ${time}ms ⏱️`);
  }
}
