import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import { getBotAvatar, getEmbedFooter } from "../../Util/Helpers.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      // Complicated way to use filename as command name (works on both windows and linux) - recommended to explicitly set it
      name: "info",
      description: "Get information about the bot"
    });
  }

  public run(interaction: ChatInputCommandInteraction) {
    const authorObject = {
      name: "About me",
      iconURL: getBotAvatar(this.client)
    };

    const description = `❯ Hello, chief! I am **Penfold**, Danger Mouse's loyal sidekick, and your faithful personal assistant on Discord! Nice to meet you! :hamster: :heart:
❯ I can help you with reminders and various utilities.
❯ If you want to see how my code works, you can access it [here](https://github.com/penfoldium/penfoldbot)!
❯ My creators are \`yoshifan13\` and \`raplayer\` - if you find any issues or have any ideas for new features, don't hesitate to contact them!
❯ Alternatively, you can submit an issue on the Git linked above.
❯ You can also find us on the Penfoldbot server - just send \`/server\` for an invite!
❯ Cor, I hope we can be good friends! :blush:`;

    const embed = new EmbedBuilder()
      .setAuthor(authorObject)
      .setDescription(description)
      .setFooter(getEmbedFooter(interaction))
      .setImage("https://media.giphy.com/media/xjad5UahGy9b6qX0gd/giphy.gif")
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
}
