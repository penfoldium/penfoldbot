import { parse } from "chrono-node";
import {
  AutocompleteInteraction,
  MessageFlags,
  type ChatInputCommandInteraction
} from "discord.js";
import timezone from "timezones-list";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../Classes/PenfoldCommand.js";
import {
  PenfoldSlashCommandBooleanOption,
  PenfoldSlashCommandStringOption,
  PenfoldSlashCommandSubcommandBuilder
} from "../Classes/PenfoldSlashCommandBuilders.js";
import { getAllLocales, getEnglishLocale, getLocaleString } from "../Util/Helpers.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "settings.name",
      description: "settings.description"
    });

    this.builder
      // set subcommand
      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("settings.subcommands.set.name")
          .localizeDescription("settings.subcommands.set.description")

          .addStringOption(
            new PenfoldSlashCommandStringOption()
              .localizeName("settings.options.option.name")
              .localizeDescription("settings.options.option.description")

              .addChoices(
                {
                  name: getEnglishLocale("settings.options.option.choices.timezone"),
                  value: "timezone",
                  name_localizations: getAllLocales("settings.options.option.choices.timezone")
                },
                {
                  name: getEnglishLocale("settings.options.option.choices.dailydmtime"),
                  value: "dailydmtime",
                  name_localizations: getAllLocales("settings.options.option.choices.dailydmtime")
                }
              )
              .setRequired(true)
          )
          .addStringOption(
            new PenfoldSlashCommandStringOption()
              .localizeName("settings.options.value.name")
              .localizeDescription("settings.options.value.description")
              .setAutocomplete(true)
              .setRequired(true)
          )
      )

      // list subcommand
      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("settings.subcommands.list.name")
          .localizeDescription("settings.subcommands.list.description")
      )

      // toggle daily subcommand
      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("settings.subcommands.toggledaily.name")
          .localizeDescription("settings.subcommands.toggledaily.description")

          .addBooleanOption(
            new PenfoldSlashCommandBooleanOption()
              .localizeName("settings.options.value.name")
              .localizeDescription("settings.options.value.description")
              .setRequired(true)
          )
      );
  }

  public override async autocomplete(interaction: AutocompleteInteraction) {
    if (interaction.options.getString("option") !== "timezone") {
      await interaction.respond([]);
      return;
    }

    const focused = interaction.options.getFocused();
    const choices = timezone.default
      .map(tz => tz.tzCode)
      .filter(choice => choice.toLowerCase().includes(focused.toLowerCase()))
      .slice(0, 25);
    const response = choices.map(choice => ({ name: choice, value: choice }));
    await interaction.respond(response);
  }

  public async run(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    if (subcommand == "set") return this.set(interaction);
    if (subcommand == "list") return this.list(interaction);
    if (subcommand == "toggledaily") return this.toggledaily(interaction);
  }

  public async set(interaction: ChatInputCommandInteraction) {
    const option = interaction.options.getString("option", true) as "timezone" | "dailydmtime";
    const newValue = interaction.options.getString("value", true);
    let data: { timezone: string } | { dailyDmTime: string };

    if (option == "dailydmtime") {
      const parsed = parse(newValue)[0]?.start;
      if (!parsed) {
        await interaction.editReply(
          getLocaleString("settings.strings.set_valid_time", interaction)
        );
        return;
      }

      const [hour, minute] = [parsed?.get("hour"), parsed?.get("minute")];
      data = { dailyDmTime: `${hour}:${minute}` };
    } else {
      if (!timezone.default.some(e => e.tzCode == newValue))
        return interaction.editReply(
          getLocaleString("settings.strings.invalid_timezone", interaction)
        );

      data = { timezone: newValue };
    }

    await this.client.db.userSettings
      .update({
        where: { id: BigInt(interaction.user.id) },
        data
      })
      .catch(err => {
        return interaction.editReply(
          getLocaleString("settings.strings.went_wrong", interaction, { err })
        );
      });

    return interaction.editReply(getLocaleString("settings.strings.edit_success", interaction));
  }

  public async list(interaction: ChatInputCommandInteraction) {
    const settings = await this.client.db.userSettings.findUnique({
      where: {
        id: BigInt(interaction.user.id)
      }
    });

    if (!settings) return;
    interaction.editReply(
      getLocaleString("settings.strings.current_settings", interaction, {
        dailyDmTime: settings.dailyDmTime,
        dailyDmEnabled: settings.dailyDmEnabled,
        timezone: settings.timezone
      })
    );
  }

  public async toggledaily(interaction: ChatInputCommandInteraction) {
    const newValue = interaction.options.getBoolean("value", true);

    const updated = await this.client.db.userSettings
      .update({
        where: {
          id: BigInt(interaction.user.id)
        },
        data: {
          dailyDmEnabled: newValue
        }
      })
      .catch(async err => {
        await interaction.editReply(
          getLocaleString("settings.strings.went_wrong", interaction, { err })
        );
        return;
      });

    if (!updated) return;
    return interaction.editReply(
      updated.dailyDmEnabled == true
        ? getLocaleString("settings.strings.toggled_enabled", interaction)
        : getLocaleString("settings.strings.toggled_disabled", interaction)
    );
  }
}
