import dayjs from "dayjs";
import { EmbedBuilder, version, type ChatInputCommandInteraction } from "discord.js";
import { execSync } from "node:child_process";
import { arch, cpus, freemem, release, totalmem, type, uptime } from "node:os";
import * as pkg from "../../../package.json" with { type: "json" };
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import { bToGB, getBotAvatar, getLocaleString } from "../../Util/Helpers.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "stats.name",
      description: "stats.description"
    });
  }

  public async run(interaction: ChatInputCommandInteraction) {
    let [activeUsers, users, guilds, channels] = [0, 0, 0, 0];

    const memory = process.memoryUsage().heapUsed / 1024 / 1024;

    if (this.client.shard) {
      const results: number[][] = await this.client.shard.broadcastEval(client => [
        client.users.cache.size,
        client.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0),
        client.guilds.cache.size,
        client.channels.cache.size
      ]);
      for (const result of results) {
        activeUsers += result[0]!;
        users += result[1]!;
        guilds += result[2]!;
        channels += result[3]!;
      }
    } else {
      activeUsers = this.client.users.cache.size;
      users = this.client.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0);
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
        free: bToGB(freemem()),
        total: bToGB(totalmem())
      }
    };

    const fields = [
      {
        name: getLocaleString("stats.strings.connected_to.name", interaction),
        value: getLocaleString("stats.strings.connected_to.value", interaction, {
          guilds: info.guilds,
          channels: info.channels,
          users: info.users,
          activeUsers: info.activeUsers
        })
      },
      {
        name: getLocaleString("stats.strings.collections_loaded.name", interaction),
        value: getLocaleString("stats.strings.collections_loaded.value", interaction, {
          commands: this.client.commands.size,
          events: this.client.events.size,
          tasks: this.client.tasks.size
        })
      },
      {
        // (Active users are counted for the past 30 minutes)\n\n
        name: getLocaleString("stats.strings.os_info.name", interaction),
        value: getLocaleString("stats.strings.os_info.value", interaction, {
          os: `${type()} ${release()} ${arch()}`,
          uptime: info.uptime,
          cpu: info.cpuModel.trim(),
          free: info.RAM.free,
          total: info.RAM.total
        })
      },
      {
        name: getLocaleString("stats.strings.bot_info.name", interaction),
        value: getLocaleString("stats.strings.bot_info.value", interaction, {
          uptime: info.botUptime,
          usage: info.RAM.usage,
          commit: hash.substring(0, 7),
          hash,
          node_version: process.version,
          djs_version: version,
          penfold_version: pkg.default.version
        })
      }
    ];

    const embed = new EmbedBuilder()
      .setAuthor({
        name: getLocaleString("stats.strings.bot_statistics", interaction),
        iconURL: getBotAvatar(this.client)
      })
      .addFields(fields);
    return interaction.reply({ embeds: [embed] });
  }
}
