import type { ChatInputCommandInteraction } from "discord.js";
import ms from "ms";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "ping",
      description: "Test the time it takes between you sending a message and Penfold receiving it"
    });
  }

  public async run(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Ping?");
    const reply = await interaction.fetchReply();
    const time = reply.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply(`🏓 Pong! Took ${ms(time)} ⏱️`);
  }
}
