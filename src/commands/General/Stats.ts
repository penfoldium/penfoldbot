import { ApplyOptions } from "@sapphire/decorators";
import { Command, version as sapphireVersion } from "@sapphire/framework";
import { DurationFormatter } from "@sapphire/time-utilities";
import { execSync } from "child_process";
import {
  ColorResolvable,
  MessageEmbed,
  version as discordVersion,
} from "discord.js";
import os from "os";

@ApplyOptions<Command.Options>({
  description: "Get system information about the bot and the server it's hosted on",
})
export class UserCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
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

  public override async chatInputRun(
    interaction: Command.ChatInputInteraction
  ) {
    let [activeUsers, users, guilds, channels, memory] = [0, 0, 0, 0, 0];

    if (interaction.client.shard) {
      const results = await interaction.client.shard.broadcastEval((client) => [
        client.users.cache.size,
        client.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0),
        client.guilds.cache.size,
        client.channels.cache.size,
        process.memoryUsage().heapUsed / 1024 / 1024,
      ]);

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

    const embed = new MessageEmbed()
      .setColor(interaction.client.options.config.embedHex as ColorResolvable)
      .setAuthor({
        name: "System Information",
        iconURL: interaction.client.user?.displayAvatarURL({
          size: 128,
          format: "png",
          dynamic: true,
        }),
      })
      .addFields(
        {
          name: "Connected to:",
          value: `**${(
            guilds || interaction.client.guilds.cache.size
          ).toLocaleString()}** servers | **${(
            channels || interaction.client.channels.cache.size
          ).toLocaleString()}** channels  | **${(
            users ||
            interaction.client.guilds.cache.reduce(
              (acc, cur) => acc + cur.memberCount,
              0
            )
          ).toLocaleString()}** users  | **${(
            activeUsers || interaction.client.users.cache.size
          ).toLocaleString()}** active users`,
        },
        {
          name: "(Active users are counted for the past 30 minutes)\n\nOS Information:",
          value: [
            `**${os.type()} ${os.release()} ${os.arch()}**`,
            `**System uptime:** ${durationFormat.format(os.uptime() * 1000)}`,
            `**CPU:** ${os.cpus()[0].model.trim()}`,
            `**RAM:** ${this.bToGB(os.freemem())}GB free of ${this.bToGB(
              os.totalmem()
            )}GB`,
          ].join("\n"),
        },
        {
          name: "Bot Information:",
          value: [
            `**Bot uptime:** ${durationFormat.format(
              interaction.client.uptime ?? 0
            )}`,
            `**RAM usage:** ${(
              memory || process.memoryUsage().heapUsed / 1024 / 1024
            ).toFixed(2)}MB`,
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

  private bToGB(bytes: number) {
    const byte = 0.00000095367432 / 1000;
    return (byte * bytes).toFixed(2);
  }
}
