import { ApplyOptions } from "@sapphire/decorators";
import { fetch, FetchResultTypes } from "@sapphire/fetch";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { ColorResolvable, MessageEmbed, User } from "discord.js";

@ApplyOptions<Subcommand.Options>({
  description: "A basic slash command",
  subcommands: [
    {
      name: "cuddle",
      chatInputRun: "cuddle",
    },
    {
      name: "feed",
      chatInputRun: "feed",
    },
    {
      name: "hug",
      chatInputRun: "hug",
    },
    {
      name: "kiss",
      chatInputRun: "kiss",
    },
    {
      name: "pat",
      chatInputRun: "pat",
    },
    {
      name: "slap",
      chatInputRun: "slap",
    },
    {
      name: "tickle",
      chatInputRun: "tickle",
    },
  ],
})
export class ActionCommand extends Subcommand {
  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addSubcommand((command) =>
            command
              .setName("cuddle")
              .setDescription("Cuddle up!")
              .addUserOption((input) =>
                input
                  .setName("user")
                  .setDescription("Mention the user you want to cuddle with!")
                  .setRequired(true)
              )
          )
          .addSubcommand((command) =>
            command
              .setName("feed")
              .setDescription("Feed someone!")
              .addUserOption((input) =>
                input
                  .setName("user")
                  .setDescription("Mention the user you want to feed!")
                  .setRequired(true)
              )
          )
          .addSubcommand((command) =>
            command
              .setName("hug")
              .setDescription("Hug it out!")
              .addUserOption((input) =>
                input
                  .setName("user")
                  .setDescription("Mention the user you want to hug!")
                  .setRequired(true)
              )
          )
          .addSubcommand((command) =>
            command
              .setName("kiss")
              .setDescription("Kiss someone!")
              .addUserOption((input) =>
                input
                  .setName("user")
                  .setDescription("Mention the user you want to kiss!")
                  .setRequired(true)
              )
          )
          .addSubcommand((command) =>
            command
              .setName("pat")
              .setDescription("Pat someone!")
              .addUserOption((input) =>
                input
                  .setName("user")
                  .setDescription("Mention the user you want to pat!")
                  .setRequired(true)
              )
          )
          .addSubcommand((command) =>
            command
              .setName("slap")
              .setDescription("Take revenge on someone!")
              .addUserOption((input) =>
                input
                  .setName("user")
                  .setDescription("Mention the user you want to slap!")
                  .setRequired(true)
              )
          )
          .addSubcommand((command) =>
            command
              .setName("tickle")
              .setDescription("Tickle time!")
              .addUserOption((input) =>
                input
                  .setName("user")
                  .setDescription("Mention the user you want to tickle!")
                  .setRequired(true)
              )
          ),
      {
        idHints: [
          // Alex's testing bot
          "1051444536964026440",
        ],
      }
    );
  }

  public cuddle(interaction: Subcommand.ChatInputInteraction) {
    return this.reply(
      interaction,
      (author, user) => {
        return user.id === interaction.client.user?.id
          ? `*You're pretty cuddly, ${author}...*` // @bot
          : user.id === author.id
          ? `It's no problem if you're alone, ${author} - I love to cuddle with my friends!` // @self
          : `${author} is cuddling you, ${user}!`; // @user
      },
      "cuddle"
    );
  }

  public feed(interaction: Subcommand.ChatInputInteraction) {
    return this.reply(
      interaction,
      (author, user) => {
        return user.id === interaction.client.user?.id
          ? `Sure, I'll take that, ${author}! :yum:` // @bot
          : user.id === author.id
          ? `Oh, I don't mind sharing my food with you, ${author}!` // @self
          : `${user}, here's some food from ${author}!`; // @user
      },
      "feed"
    );
  }

  public hug(interaction: Subcommand.ChatInputInteraction) {
    return this.reply(
      interaction,
      (author, user) => {
        return user.id === interaction.client.user?.id
          ? `Oh, you're hugging me, ${author}... :heart:` // @bot
          : user.id === author.id
          ? `${author}, I see you're lonely, chief... let me give you a hug :heart:` // @self
          : `${user}, here's a hug from ${author}! :heart:`; // @user
      },
      "hug"
    );
  }

  public kiss(interaction: Subcommand.ChatInputInteraction) {
    return this.reply(
      interaction,
      (author, user) => {
        return user.id === interaction.client.user?.id
          ? `\\*blushing\\* *That's so sweet of you, ${author}...*` // @bot
          : user.id === author.id
          ? `Nobody around? I guess a friendly kiss from me won't hurt you, ${author}!` // @self
          : `${user}, here's a kiss from ${author}!`; // @user
      },
      "kiss"
    );
  }

  public pat(interaction: Subcommand.ChatInputInteraction) {
    return this.reply(
      interaction,
      (author, user) => {
        return user.id === interaction.client.user?.id
          ? `*It feels good, ${author}, keep going...*` // @bot
          : user.id === author.id
          ? `You're an amazing friend, ${author}, so you deserve it!` // @self
          : `${user}, here's a pat from ${author}!`; // @user
      },
      "pat"
    );
  }

  public slap(interaction: Subcommand.ChatInputInteraction) {
    return this.reply(
      interaction,
      (author, user) => {
        return user.id === interaction.client.user?.id
          ? `Ouch! What have I done to you, ${author}?` // @bot
          : user.id === author.id
          ? `Why are you slapping yourself, ${author}?` // @self
          : `Hey ${user}, you've just been slapped by ${author}`; // @user
      },
      "slap"
    );
  }

  public tickle(interaction: Subcommand.ChatInputInteraction) {
    return this.reply(
      interaction,
      (author, user) => {
        return user.id === interaction.client.user?.id
          ? `Hey! Stop tickling me, ${author}!!` // @bot
          : user.id === author.id
          ? `${author}, it's tickle time!` // @self
          : `${user}, ${author} is tickling you!`; // @user
      },
      "tickle"
    );
  }

  private async reply(
    interaction: Subcommand.ChatInputInteraction,
    description: (author: User, user: User) => string,
    action: string
  ) {
    await interaction.deferReply();
    const user = interaction.options.getUser("user", true);

    const image = await this.fetchImage(action);

    const embed = new MessageEmbed()
      .setColor(interaction.client.options.config.embedHex as ColorResolvable)
      .setDescription(description(interaction.user, user))
      .setImage(image)
      .setFooter({
        text: `Powered by nekos.life`,
        iconURL: interaction.user.displayAvatarURL({
          size: 1024,
          format: "png",
          dynamic: true,
        }),
      });

    return interaction.editReply({ embeds: [embed] });
  }

  private async fetchImage(action: string): Promise<string> {
    const result: { url: string } = await fetch(
      `https://nekos.life/api/v2/img/${action}`,
      FetchResultTypes.JSON
    );

    return result.url;
  }
}
