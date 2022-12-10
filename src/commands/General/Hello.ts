import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { ColorResolvable, MessageEmbed, User } from "discord.js";

@ApplyOptions<Command.Options>({
  description: "Provides some information about this bot.",
})
export class HelloCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
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

  public override async chatInputRun(
    interaction: Command.ChatInputInteraction
  ) {
    await interaction.client.application!.fetch();
    const owners =
      interaction.client.application!.owner instanceof User
        ? interaction.client.application!.owner.tag
        : Array.from(interaction.client.application!.owner!.members.values())
            .map((member) => member.user.tag)
            .join("` & `");

    const embed = new MessageEmbed()
      .setAuthor({
        name: "About me",
        iconURL: interaction.client.user!.displayAvatarURL({
          size: 1024,
          format: "png",
        }),
      })
      .setDescription(
        `
❯ Hello, chief! I am **Penfold**, Danger Mouse's loyal sidekick, and your faithful personal assistant on Discord! Nice to meet you! :hamster: :heart:
❯ I can help you with reminders and various utilities.
❯ If you want to see how my code works, you can access it [here](https://github.com/penfoldium/penfoldbot)!
❯ My creators are [YoshiFan13](https://github.com/YoshiFan13) and [AlexTheMaster](https://github.com/alexthemaster/). I'm currently being maintained by \`${owners}\` - if you find any issues or have any ideas for new features, don't hesitate to contact them!
❯ Alternatively, you can submit an issue on the Git linked above.
❯ You can also find us on the Penfoldbot server - just send \`/server\` for an invite!
❯ Cor, I hope we can be good friends! :blush:`
      )
      .setColor(interaction.client.options.config.embedHex as ColorResolvable)
      .setImage("https://media.giphy.com/media/xjad5UahGy9b6qX0gd/giphy.gif");
    return await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}
