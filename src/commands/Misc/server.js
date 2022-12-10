const { Command } = require("@sapphire/framework");

class ServerCommand extends Command {
  /**
   * @param {Command.Context} context
   */
  constructor(context) {
    super(context, {
      name: "server",
      description: "Join the bot's official Discord server",
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
          "1051035777968128090",
        ],
      }
    );
  }

  /**
   * @param {Command.ChatInputInteraction} interaction
   */
  async chatInputRun(interaction) {
    const { serverInvite } = interaction.client.options.config;
    return await interaction.reply({
      content: serverInvite
        ? `Here's an invite to my official Discord server! https://discord.gg/${serverInvite}`
        : // TODO(Seb): Modify this line?
          "Unfortunately, I don't have a support server configured. Perhaps contact the owners about this?",
      ephemeral: true,
    });
  }
}

module.exports = {
  ServerCommand,
};
