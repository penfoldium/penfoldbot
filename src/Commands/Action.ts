import {
  EmbedBuilder,
  SlashCommandStringOption,
  SlashCommandUserOption,
  type ChatInputCommandInteraction,
  type User
} from "discord.js";
import NekoClient from "nekos.life";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../Classes/PenfoldCommand.js";
import { getBotAvatar } from "../Util/Helpers.js";

export default class extends PenfoldCommand {
  actions = ["cuddle", "feed", "hug", "kiss", "pat", "poke", "slap", "tickle"] as const;
  nekoapi = new NekoClient();

  constructor(client: PenfoldClient) {
    super(client, {
      name: "action",
      description: "Some fun actions to do to other users!"
    });

    this.builder

      .addStringOption(
        new SlashCommandStringOption()
          .setName("action")
          .setDescription("What action to do")
          .setChoices(
            this.actions.map(action => {
              return { name: action, value: action };
            })
          )
          .setRequired(true)
      )

      .addUserOption(
        new SlashCommandUserOption()
          .setName("user")
          .setDescription("The user to use the action on")
          .setRequired(true)
      );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const action = interaction.options.getString("action", true) as (typeof this.actions)[number];
    const user = interaction.options.getUser("user", true);
    this[action](interaction, user);
  }

  public async cuddle(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.cuddle();
    const description =
      user.id === interaction.client.user.id
        ? `*You're pretty cuddly, ${interaction.user}...*` // @bot
        : user === interaction.user
          ? `It's no problem if you're alone, ${user} - I love to cuddle with my friends!` // @self
          : `${interaction.user} is cuddling you, ${user}!`; // @user

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({ name: `Cuddle!`, iconURL: getBotAvatar(interaction.client) })
      .setFooter({
        text: "Powered by nekos.life"
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async feed(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.feed();
    const description =
      user.id === interaction.client.user.id
        ? `Sure, I'll take that, ${interaction.user}! :yum:` // @bot
        : user === interaction.user
          ? `Oh, I don't mind sharing my food with you, ${user}!` // @self
          : `${user}, here's some food from ${interaction.user}!`; // @user

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({ name: `Feed!`, iconURL: getBotAvatar(interaction.client) })
      .setFooter({
        text: "Powered by nekos.life"
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async hug(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.hug();

    const description =
      user.id === interaction.client.user.id
        ? `Oh, you're hugging me, ${interaction.user}... :heart:` // @bot
        : user === interaction.user
          ? `${user}, I see you're lonely, chief... let me give you a hug :heart:` // @self
          : `${user}, here's a hug from ${interaction.user}! :heart:`; // @user

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({ name: `Hug!`, iconURL: getBotAvatar(interaction.client) })
      .setFooter({
        text: "Powered by nekos.life"
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async kiss(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.kiss();
    const description =
      user.id === interaction.client.user.id
        ? `\\*blushing\\* *That's so sweet of you, ${interaction.user}...*` // @bot
        : user === interaction.user
          ? `Nobody around? I guess a friendly kiss from me won't hurt you, ${user}!` // @self
          : `${user}, here's a kiss from ${interaction.user}!`; // @user

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({ name: `Kiss!`, iconURL: getBotAvatar(interaction.client) })
      .setFooter({
        text: "Powered by nekos.life"
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async pat(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.pat();
    const description =
      user.id === interaction.client.user.id
        ? `*It feels good, ${interaction.user}, keep going...*` // @bot
        : user === interaction.user
          ? `You're an amazing friend, ${user}, so you deserve it!` // @self
          : `${user}, here's a pat from ${interaction.user}`; // @user

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({ name: `Pat!`, iconURL: getBotAvatar(interaction.client) })
      .setFooter({
        text: "Powered by nekos.life"
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async poke(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.poke();
    const description =
      user.id === interaction.client.user.id
        ? `Ow. Watch it, ${interaction.user}!` // @bot
        : user === interaction.user
          ? `\\*pokes ${user}\\*` // @self
          : `${user}, ${interaction.user} is poking you!`; // @user

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({ name: `Poke!`, iconURL: getBotAvatar(interaction.client) })
      .setFooter({
        text: "Powered by nekos.life"
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async slap(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.slap();
    const description =
      user.id === interaction.client.user.id
        ? `Ouch! What have I done to you, ${interaction.user}?` // @bot
        : user === interaction.user
          ? `Why are you slapping yourself, ${user}?` // @self
          : `Hey ${user}, you've just been slapped by ${interaction.user}`; // @user

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({ name: `Slap!`, iconURL: getBotAvatar(interaction.client) })
      .setFooter({
        text: "Powered by nekos.life"
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async tickle(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.tickle();
    const description =
      user.id === interaction.client.user.id
        ? `Hey! Stop tickling me, ${interaction.user}!!` // @bot
        : user === interaction.user
          ? `${user}, it's tickle time!` // @self
          : `${user}, ${interaction.user} is tickling you!`; // @user

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({ name: `Tickle!`, iconURL: getBotAvatar(interaction.client) })
      .setFooter({
        text: "Powered by nekos.life"
      });

    await interaction.editReply({ embeds: [embed] });
  }
}
