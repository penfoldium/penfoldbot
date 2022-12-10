const { Command } = require("@sapphire/framework");
const { MessageEmbed } = require("discord.js");

class HelloCommand extends Command {
  /**
   * @param {Command.Context} context
   */
  constructor(context) {
    super(context, {
      name: "hello",
      description: "Provides some information about this bot.",
    });
  }

  /**
   * @param {Command.Registry} registry
   */
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description),
      {
        idHints: [
          // Alex's testing bot
          "1051031868646096916",
          // Penfold (production)
          "1051033401190273054",
        ],
      }
    );
  }

  /**
   * @param {Command.ChatInputInteraction} interaction
   */
  async chatInputRun(interaction) {
    await interaction.client.application.fetch();
    const owner = interaction.client.application.owner.members
      ? Array.from(interaction.client.application.owner.members.values())
          .map((member) => member.user.tag)
          .join("` & `")
      : interaction.client.application.owner.tag;

    const embed = new MessageEmbed()
      .setAuthor({
        name: "About me",
        iconURL: interaction.client.user.displayAvatarURL({
          size: 1024,
          format: "png",
        }),
      })
      .setDescription(
        `
❯ Hello, chief! I am **Penfold**, Danger Mouse's loyal sidekick, and your faithful personal assistant on Discord! Nice to meet you! :hamster: :heart:
❯ I can help you with reminders and various utilities.
❯ If you want to see how my code works, you can access it [here](https://github.com/penfoldium/penfoldbot)!
❯ My creators are [YoshiFan13](https://github.com/YoshiFan13) and [AlexTheMaster](https://github.com/alexthemaster/). I'm currently being mainteined by \`${owner}\` - if you find any issues or have any ideas for new features, don't hesitate to contact them!
❯ Alternatively, you can submit an issue on the Git linked above.
❯ You can also find us on the Penfoldbot server - just send \`/server\` for an invite!
❯ Cor, I hope we can be good friends! :blush:`
      )
      .setColor(interaction.client.options.config.embedHex)
      .setImage("https://media.giphy.com/media/xjad5UahGy9b6qX0gd/giphy.gif");
    return await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}

module.exports = {
  HelloCommand,
};
