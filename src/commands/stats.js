const { Command, version: sapphireVersion } = require("@sapphire/framework");
const { DurationFormatter } = require("@sapphire/time-utilities");
const { version: discordVersion, MessageEmbed } = require("discord.js");
const { execSync } = require("child_process");
const os = require("os");

class StatsCommand extends Command {
  /**
   * @param {Command.Context} context
   */
  constructor(context) {
    super(context, {
      name: "stats",
      // TODO(Seb): add proper description
      description: "Information about the bot and server it's running on",
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
          "1050854851946487828",
          // Penfold (production)
          "1050858778842644530",
        ],
      }
    );
  }

  /**
   * @param {Command.ChatInputInteraction} interaction
   */
  async chatInputRun(interaction) {
    let [activeUsers, users, guilds, channels, memory] = [0, 0, 0, 0];

    if (interaction.client.shard) {
      const results = await interaction.client.shard.broadcastEval(
        "[this.users.cache.size, this.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0), this.guilds.cache.size, this.channels.cache.size, (process.memoryUsage().heapUsed / 1024 / 1024)]"
      );
      for (const result of results) {
        activeUsers += result[0];
        users += result[1];
        guilds += result[2];
        channels += result[3];
        memory += result[4];
      }
    }

    const hash = execSync("git rev-parse HEAD").toString().trim();

    const durationFormat = new DurationFormatter();

    const info = {
      guilds: (guilds || interaction.client.guilds.cache.size).toLocaleString(),
      channels: (
        channels || interaction.client.channels.cache.size
      ).toLocaleString(),
      users: (
        users ||
        interaction.client.guilds.cache.reduce(
          (acc, cur) => acc + cur.memberCount,
          0
        )
      ).toLocaleString(),
      activeUsers: (
        activeUsers || interaction.client.users.cache.size
      ).toLocaleString(),

      botUptime: durationFormat.format(interaction.client.uptime),
      uptime: durationFormat.format(os.uptime() * 1000),
      cpuModel: os.cpus()[0].model,

      RAM: {
        usage: (memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        ),
        free: this.bToGB(os.freemem),
        total: this.bToGB(os.totalmem),
      },
    };

    const embed = new MessageEmbed()
      .setColor(interaction.client.options.config.embedHex)
      .setAuthor({
        name: "System Information",
        iconURL: interaction.client.user.displayAvatarURL({
          size: 128,
          format: "png",
          dynamic: true,
        }),
      })
      .addFields(
        {
          name: "Connected to:",
          value: `**${info.guilds}** servers | **${info.channels}** channels  | **${info.users}** users  | **${info.activeUsers}** active users`,
        },
        {
          name: "(Active users are counted for the past 30 minutes)\n\nOS Information:",
          value: [
            `**${os.type()} ${os.release()} ${os.arch()}**`,
            `**System uptime:** ${info.uptime}`,
            `**CPU:** ${info.cpuModel.trim()}`,
            `**RAM:** ${info.RAM.free}GB free of ${info.RAM.total}GB`,
          ].join("\n"),
        },
        {
          name: "Bot Information:",
          value: [
            `**Bot uptime:** ${info.botUptime}`,
            `**RAM usage:** ${info.RAM.usage}MB`,
            `**Commit:** [${hash.substring(
              0,
              7
            )}](https://github.com/penfoldium/penfoldbot/commit/${hash})`,
            `\n**Node.js version:** ${process.version}`,
            `**Discord.js version:** v${discordVersion}`,
            `**Sapphire framework version:** v${sapphireVersion}`,
          ].join("\n"),
        }
      );

    return await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  bToGB(bytes) {
    const byte = 0.00000095367432 / 1000;
    return (byte * bytes).toFixed(2);
  }
}

module.exports = {
  StatsCommand,
};
