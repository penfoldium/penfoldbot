import type { ChatInputCommandInteraction } from "discord.js";
import ms from "ms";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import { getLocaleString } from "../../Util/Helpers.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "ping.name",
      description: "ping.description"
    });
  }

  public async run(interaction: ChatInputCommandInteraction) {
    await interaction.reply(getLocaleString("ping.strings.ping", interaction));
    const reply = await interaction.fetchReply();
    const time = ms(reply.createdTimestamp - interaction.createdTimestamp);

    await interaction.editReply(getLocaleString("ping.strings.pong", interaction, { time }));
  }
}
