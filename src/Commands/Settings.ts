import {
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import timezone from "timezones-list";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../Classes/PenfoldCommand.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "settings",
      description: "View and modify your user settings",
    });

    this.builder
      // set subcommand
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("set")
          .setDescription("Modify your user settings")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("option")
              .setDescription("Which setting to change")
              .setChoices(
                {
                  name: "Timezone",
                  value: "timezone",
                },
                {
                  name: "Daily DM Time",
                  value: "dailydmtime",
                }
              )
              .setRequired(true)
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName("value")
              .setDescription("New value")
              .setRequired(true)
          )
      )

      // list subcommand
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("list")
          .setDescription("List your current user settings")
      );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply();
    if (subcommand == "set") return this.set(interaction);
    if (subcommand == "list") return this.list(interaction);
  }

  public async set(interaction: ChatInputCommandInteraction) {
    await this.ensureUserSettings(interaction.user.id);
    const option = interaction.options.getString("option", true);
    const newValue = interaction.options.getString("value", true);

    if (
      option == "timezone" &&
      !timezone.default.some((e) => e.tzCode == newValue)
    )
      return interaction.editReply(
        `The provided timezone is not valid. See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for details (make sure to use the \`TZ identified\`!) - Case sensitive!`
      );

    let data: { timezone: string } | { dailyDmTime: string };
    if (option == "timezone") data = { timezone: newValue };
    else data = { dailyDmTime: newValue };

    await this.client.db.userSettings
      .update({
        where: { id: Number(interaction.user.id) },
        data,
      })
      .catch((err) => {
        return interaction.editReply(
          `Something went wrong while updating your settings: ${err}`
        );
      });

    return interaction.editReply("Successfully edited your settings!");
  }

  public async list(interaction: ChatInputCommandInteraction) {
    const settings = await this.ensureUserSettings(interaction.user.id);
    interaction.editReply(`Here are your current settings:
Daily DM time: \`${settings.dailyDmTime}\`
Timezone: \`${settings.timezone}\``);
  }

  public async ensureUserSettings(id: string) {
    let settings = await this.client.db.userSettings.findUnique({
      where: { id: Number(id) },
    });

    if (!settings) {
      settings = await this.client.db.userSettings.create({
        data: {
          id: Number(id),
        },
      });
    }

    return settings;
  }
}
