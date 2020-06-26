const { Command, version: klasaVersion, Duration } = require("klasa");
const { version: discordVersion, MessageEmbed } = require("discord.js");
const { execSync } = require("child_process");
const os = require("os");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      guarded: true,
      deletable: true,
      requiredPermissions: ["EMBED_LINKS"],
      description: language => language.get("COMMAND_STATS_DESCRIPTION")
    });
  }

  async run(message) {
    let [activeUsers, users, guilds, channels, memory] = [0, 0, 0, 0];

    if (this.client.shard) {
      const results = await this.client.shard.broadcastEval(
        `this.users.size, [this.guilds.reduce((acc, cur) => acc + cur.memberCount, 0), this.guilds.size, this.channels.size, (process.memoryUsage().heapUsed / 1024 / 1024)]`
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

    const info = {
      guilds: (guilds || this.client.guilds.size).toLocaleString(),
      channels: (channels || this.client.channels.size).toLocaleString(),
      users: (
        users ||
        this.client.guilds.reduce((acc, cur) => acc + cur.memberCount, 0)
      ).toLocaleString(),
      activeUsers: (activeUsers || this.client.users.size).toLocaleString(),

      botUptime: Duration.toNow(Date.now() - this.client.uptime),
      uptime: Duration.toNow(Date.now() - os.uptime() * 1000),
      cpuModel: os.cpus()[0].model,

      RAM: {
        usage: (memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        ),
        free: this.bToGB(os.freemem),
        total: this.bToGB(os.totalmem)
      }
    };

    const embed = new MessageEmbed()
      .setColor(this.client.options.config.embedHex)
      .setAuthor(
        "System Information",
        this.client.user.displayAvatarURL({
          size: 128,
          format: "png",
          dynamic: true
        })
      )

      .addField(
        "Connected to:",
        `**${info.guilds}** servers | **${info.channels}** channels  | **${info.users}** users  | **${info.activeUsers}** active users`
      )

      .addField(
        "(Active users are counted for the past 30 minutes)\n\nOS Information:",
        [
          `**${os.type()} ${os.release()} ${os.arch()}**`,
          `**System uptime:** ${info.uptime}`,
          `**CPU:** ${info.cpuModel.trim()}`,
          `**RAM:** ${info.RAM.free}GB free of ${info.RAM.total}GB`
        ].join("\n")
      )

      .addField(
        "Bot Information:",
        [
          `**Bot uptime:** ${info.botUptime}`,
          `**RAM usage:** ${info.RAM.usage}MB`,
          `**Commit:** [${hash.substr(
            0,
            7
          )}](https://github.com/penfoldium/penfoldbot/commit/${hash})`,
          `\n**Node.js version:** ${process.version}`,
          `**Discord.js version:** ${discordVersion}`,
          `**Klasa framework version:** ${klasaVersion}`
        ].join("\n")
      )

      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({
          size: 128,
          format: "png",
          dynamic: true
        })
      )
      .setTimestamp();
    return message.send(embed);
  }

  bToGB(bytes) {
    const byte = 0.00000095367432 / 1000;
    return (byte * bytes).toFixed(2);
  }
};
