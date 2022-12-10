import { ApplyOptions } from "@sapphire/decorators";
import { isMessageInstance } from "@sapphire/discord.js-utilities";
import { Command } from "@sapphire/framework";
import type { Message } from "discord.js";

@ApplyOptions<Command.Options>({
  description: "Ping bot to see if it is alive",
})
export class PingCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
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

  public override async chatInputRun(
    interaction: Command.ChatInputInteraction
  ) {
    const msg = await interaction.reply({
      content: "Ping?",
      ephemeral: true,
      fetchReply: true,
    });

    if (!isMessageInstance(msg)) {
      return interaction.editReply("Failed to retrieve ping :(");
    }

    const diff =
      (msg as Message).createdTimestamp - interaction.createdTimestamp;
    const ping = Math.round(this.container.client.ws.ping);
    return interaction.editReply(
      `Pong, chief! [Roundtrip: ${diff}ms. | Heartbeat: ${ping}ms.]`
    );
  }
}
