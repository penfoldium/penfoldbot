import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import { getBotAvatar, getLocaleString } from "../../Util/Helpers.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "info.name",
      description: "info.description"
    });
  }

  public run(interaction: ChatInputCommandInteraction) {
    const authorObject = {
      name: getLocaleString("info.strings.about_me", interaction),
      iconURL: getBotAvatar(this.client)
    };

    const embed = new EmbedBuilder()
      .setAuthor(authorObject)
      .setDescription(getLocaleString("info.strings.description", interaction))
      .setImage("https://media.giphy.com/media/xjad5UahGy9b6qX0gd/giphy.gif")
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
}
