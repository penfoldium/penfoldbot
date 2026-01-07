import { EmbedBuilder, type ChatInputCommandInteraction, type User } from "discord.js";
import NekoClient from "nekos.life";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../Classes/PenfoldCommand.js";
import {
  PenfoldSlashCommandStringOption,
  PenfoldSlashCommandUserOption
} from "../Classes/PenfoldSlashCommandBuilders.js";
import { getAllLocales, getBotAvatar, getEnglishLocale, getLocaleString } from "../Util/Helpers.js";

export default class extends PenfoldCommand {
  actions = ["cuddle", "feed", "hug", "kiss", "pat", "poke", "slap", "tickle"] as const;
  nekoapi = new NekoClient();

  constructor(client: PenfoldClient) {
    super(client, {
      name: "action.name",
      description: "action.description"
    });

    this.builder

      .addStringOption(
        new PenfoldSlashCommandStringOption()
          .localizeName("action.options.action.name")
          .localizeDescription("action.options.action.description")
          .addChoices(
            {
              name: getEnglishLocale("action.actions.cuddle"),
              name_localizations: getAllLocales("action.actions.cuddle"),
              value: "cuddle"
            },
            {
              name: getEnglishLocale("action.actions.feed"),
              name_localizations: getAllLocales("action.actions.feed"),
              value: "feed"
            },
            {
              name: getEnglishLocale("action.actions.hug"),
              name_localizations: getAllLocales("action.actions.hug"),
              value: "hug"
            },
            {
              name: getEnglishLocale("action.actions.kiss"),
              name_localizations: getAllLocales("action.actions.kiss"),
              value: "kiss"
            },
            {
              name: getEnglishLocale("action.actions.pat"),
              name_localizations: getAllLocales("action.actions.pat"),
              value: "pat"
            },
            {
              name: getEnglishLocale("action.actions.poke"),
              name_localizations: getAllLocales("action.actions.poke"),
              value: "poke"
            },
            {
              name: getEnglishLocale("action.actions.slap"),
              name_localizations: getAllLocales("action.actions.slap"),
              value: "slap"
            },
            {
              name: getEnglishLocale("action.actions.tickle"),
              name_localizations: getAllLocales("action.actions.tickle"),
              value: "tickle"
            }
          )
          .setRequired(true)
      )

      .addUserOption(
        new PenfoldSlashCommandUserOption()
          .localizeName("action.options.user.name")
          .localizeDescription("action.options.user.description")
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
    const img = await this.nekoapi.cuddle().catch(async err => {
      await interaction.editReply(
        getLocaleString("action.strings.went_wrong", interaction, { err })
      );
      return;
    });
    if (!img) return;

    const description =
      user.id === interaction.client.user.id // @bot
        ? getLocaleString("action.strings.cuddle.bot", interaction, { user: interaction.user })
        : user === interaction.user // @self
          ? getLocaleString("action.strings.cuddle.self", interaction, { user })
          : // @user
            getLocaleString("action.strings.cuddle.user", interaction, {
              user1: interaction.user,
              user2: user
            });

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({
        name: getLocaleString("action.strings.cuddle.name", interaction),
        iconURL: getBotAvatar(interaction.client)
      })
      .setFooter({
        text: getLocaleString("action.strings.powered_by", interaction)
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async feed(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.feed().catch(async err => {
      await interaction.editReply(
        getLocaleString("action.strings.went_wrong", interaction, { err })
      );
      return;
    });
    if (!img) return;

    const description =
      user.id === interaction.client.user.id // @bot
        ? getLocaleString("action.strings.feed.bot", interaction, { user: interaction.user })
        : user === interaction.user // @self
          ? getLocaleString("action.strings.feed.self", interaction, { user })
          : // @user
            getLocaleString("action.strings.feed.user", interaction, {
              user1: interaction.user,
              user2: user
            });

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({
        name: getLocaleString("action.strings.feed.name", interaction),
        iconURL: getBotAvatar(interaction.client)
      })
      .setFooter({
        text: getLocaleString("action.strings.powered_by", interaction)
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async hug(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.hug().catch(async err => {
      await interaction.editReply(
        getLocaleString("action.strings.went_wrong", interaction, { err })
      );
      return;
    });
    if (!img) return;

    const description =
      user.id === interaction.client.user.id // @bot
        ? getLocaleString("action.strings.hug.bot", interaction, { user: interaction.user })
        : user === interaction.user // @self
          ? getLocaleString("action.strings.hug.self", interaction, { user })
          : // @user
            getLocaleString("action.strings.hug.user", interaction, {
              user1: interaction.user,
              user2: user
            });

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({
        name: getLocaleString("action.strings.hug.name", interaction),
        iconURL: getBotAvatar(interaction.client)
      })
      .setFooter({
        text: getLocaleString("action.strings.powered_by", interaction)
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async kiss(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.kiss().catch(async err => {
      await interaction.editReply(
        getLocaleString("action.strings.went_wrong", interaction, { err })
      );
      return;
    });
    if (!img) return;

    const description =
      user.id === interaction.client.user.id // @bot
        ? getLocaleString("action.strings.kiss.bot", interaction, { user: interaction.user })
        : user === interaction.user // @self
          ? getLocaleString("action.strings.kiss.self", interaction, { user })
          : // @user
            getLocaleString("action.strings.kiss.user", interaction, {
              user1: interaction.user,
              user2: user
            });

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({
        name: getLocaleString("action.strings.kiss.name", interaction),
        iconURL: getBotAvatar(interaction.client)
      })
      .setFooter({
        text: getLocaleString("action.strings.powered_by", interaction)
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async pat(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.pat().catch(async err => {
      await interaction.editReply(
        getLocaleString("action.strings.went_wrong", interaction, { err })
      );
      return;
    });
    if (!img) return;

    const description =
      user.id === interaction.client.user.id // @bot
        ? getLocaleString("action.strings.pat.bot", interaction, { user: interaction.user })
        : user === interaction.user // @self
          ? getLocaleString("action.strings.pat.self", interaction, { user })
          : // @user
            getLocaleString("action.strings.pat.user", interaction, {
              user1: interaction.user,
              user2: user
            });

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({
        name: getLocaleString("action.strings.pat.name", interaction),
        iconURL: getBotAvatar(interaction.client)
      })
      .setFooter({
        text: getLocaleString("action.strings.powered_by", interaction)
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async poke(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.poke().catch(async err => {
      await interaction.editReply(
        getLocaleString("action.strings.went_wrong", interaction, { err })
      );
      return;
    });
    if (!img) return;

    const description =
      user.id === interaction.client.user.id // @bot
        ? getLocaleString("action.strings.poke.bot", interaction, { user: interaction.user })
        : user === interaction.user // @self
          ? getLocaleString("action.strings.poke.self", interaction, { user })
          : // @user
            getLocaleString("action.strings.poke.user", interaction, {
              user1: interaction.user,
              user2: user
            });

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({
        name: getLocaleString("action.strings.poke.name", interaction),
        iconURL: getBotAvatar(interaction.client)
      })
      .setFooter({
        text: getLocaleString("action.strings.powered_by", interaction)
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async slap(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.slap().catch(async err => {
      await interaction.editReply(
        getLocaleString("action.strings.went_wrong", interaction, { err })
      );
      return;
    });
    if (!img) return;

    const description =
      user.id === interaction.client.user.id // @bot
        ? getLocaleString("action.strings.slap.bot", interaction, { user: interaction.user })
        : user === interaction.user // @self
          ? getLocaleString("action.strings.slap.self", interaction, { user })
          : // @user
            getLocaleString("action.strings.slap.user", interaction, {
              user1: interaction.user,
              user2: user
            });

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({
        name: getLocaleString("action.strings.slap.name", interaction),
        iconURL: getBotAvatar(interaction.client)
      })
      .setFooter({
        text: getLocaleString("action.strings.powered_by", interaction)
      });

    await interaction.editReply({ embeds: [embed] });
  }

  public async tickle(interaction: ChatInputCommandInteraction, user: User) {
    const img = await this.nekoapi.tickle().catch(async err => {
      await interaction.editReply(
        getLocaleString("action.strings.went_wrong", interaction, { err })
      );
      return;
    });
    if (!img) return;

    const description =
      user.id === interaction.client.user.id // @bot
        ? getLocaleString("action.strings.tickle.bot", interaction, { user: interaction.user })
        : user === interaction.user // @self
          ? getLocaleString("action.strings.tickle.self", interaction, { user })
          : // @user
            getLocaleString("action.strings.tickle.user", interaction, {
              user1: interaction.user,
              user2: user
            });

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setImage(img.url)
      .setAuthor({
        name: getLocaleString("action.strings.tickle.name", interaction),
        iconURL: getBotAvatar(interaction.client)
      })
      .setFooter({
        text: getLocaleString("action.strings.powered_by", interaction)
      });

    await interaction.editReply({ embeds: [embed] });
  }
}
