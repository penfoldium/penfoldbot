const { Command } = require("@sapphire/framework");
const { isMessageInstance } = require("@sapphire/discord.js-utilities");

class PingCommand extends Command {
  constructor(context) {
    super(context, {
      name: "ping",
      description: "Ping bot to see if it is alive",
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
          "1050843864002469959",
          // Penfold (production)
          "1050858777454333993",
        ],
      }
    );
  }

  /**
   * @param {Command.ChatInputInteraction} interaction
   */
  async chatInputRun(interaction) {
    const msg = await interaction.reply({
      content: "Ping?",
      ephemeral: true,
      fetchReply: true,
    });

    if (!isMessageInstance(msg))
      return interaction.editReply("Failed to retrieve ping :(");

    const diff = msg.createdTimestamp - interaction.createdTimestamp;
    const ping = Math.round(this.container.client.ws.ping);
    return interaction.editReply(
      `Pong, chief! [Roundtrip: ${diff}ms. | Heartbeat: ${ping}ms.]`
    );
  }
}

module.exports = {
  PingCommand,
};
