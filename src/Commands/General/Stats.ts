import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import {
  EmbedBuilder,
  version,
  type ChatInputCommandInteraction,
} from "discord.js";
import { execSync } from "node:child_process";
import { arch, cpus, freemem, release, totalmem, type, uptime } from "node:os";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import { getBotAvatar, getEmbedFooter } from "../../Util/Helpers.js";
dayjs.extend(relativeTime);

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "stats",
      description: "Provides some statistics about the bot",
    });
  }

  public async run(interaction: ChatInputCommandInteraction) {
    let [activeUsers, users, guilds, channels, memory] = [
      0,
      0,
      0,
      0,
      process.memoryUsage().heapUsed / 1024 / 1024,
    ];

    if (this.client.shard) {
      const results: number[][] = await this.client.shard.broadcastEval(
        (client) => [
          client.users.cache.size,
          client.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0),
          client.guilds.cache.size,
          client.channels.cache.size,
        ]
      );
      for (const result of results) {
        activeUsers += result[0]!;
        users += result[1]!;
        guilds += result[2]!;
        channels += result[3]!;
      }
    } else {
      activeUsers = this.client.users.cache.size;
      users = this.client.guilds.cache.reduce(
        (acc, cur) => acc + cur.memberCount,
        0
      );
      channels = this.client.channels.cache.size;
      guilds = this.client.guilds.cache.size;
    }

    const hash = execSync("git rev-parse HEAD").toString().trim();

    const info = {
      guilds: guilds.toLocaleString(),
      channels: channels.toLocaleString(),
      users: users.toLocaleString(),
      activeUsers: activeUsers.toLocaleString(),

      botUptime: dayjs(Date.now() - this.client.uptime!).fromNow(true),
      uptime: dayjs(Date.now() - uptime() * 1000).fromNow(true),
      cpuModel: cpus()[0]!.model,

      RAM: {
        usage: memory.toFixed(2),
        free: this.#bToGB(freemem()),
        total: this.#bToGB(totalmem()),
      },
    };

    const fields = [
      {
        name: "Connected to:",
        value: `**${info.guilds}** servers | **${info.channels}** channels  | **${info.users}** users  | **${info.activeUsers}** active users`,
      },
      {
        name: "Collections loaded:",
        value: `**${this.client.commands.size}** commands | **${this.client.events.size}** events | **${this.client.tasks.size}** tasks`,
      },
      {
        // (Active users are counted for the past 30 minutes)\n\n
        name: "OS Information:",
        value: [
          `**${type()} ${release()} ${arch()}**`,
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
          `**Discord.js version:** v${version}`,
        ].join("\n"),
      },
    ];

    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Bot Statistics",
        iconURL: getBotAvatar(this.client),
      })
      .addFields(fields)
      .setFooter(getEmbedFooter(interaction))
      .setTimestamp();
    return interaction.reply({ embeds: [embed] });
  }

  #bToGB(bytes: number) {
    const byte = 0.00000095367432 / 1000;
    return (byte * bytes).toFixed(2);
  }
}
