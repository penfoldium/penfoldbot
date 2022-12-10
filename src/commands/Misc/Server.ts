import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";

@ApplyOptions<Command.Options>({
  description: "Returns a link to the bot's official Discord server",
})
export class ServerCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
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

  public override async chatInputRun(
    interaction: Command.ChatInputInteraction
  ) {
    const { serverInvite } = interaction.client.options.config;

    return await interaction.reply({
      content: serverInvite
        ? `Here's an invite to my official Discord server! https://discord.gg/${serverInvite}`
        : "Sorry, but I don't have a support server configured. You should contact the bot owner(s) about this.",
      ephemeral: true,
    });
  }
}
