import {
  AutocompleteInteraction,
  MessageFlags,
  SlashCommandBooleanOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  type ChatInputCommandInteraction
} from "discord.js";
import timezone from "timezones-list";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../Classes/PenfoldCommand.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "settings",
      description: "View and modify your user settings"
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
                  value: "timezone"
                },
                {
                  name: "Daily DM Time",
                  value: "dailydmtime"
                }
              )
              .setRequired(true)
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName("value")
              .setDescription("New value")
              .setAutocomplete(true)
              .setRequired(true)
          )
      )

      // list subcommand
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("list")
          .setDescription("List your current user settings")
      )

      // toggle daily subcommand
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("toggledaily")
          .setDescription("Toggle Daily DMs on and off")
          .addBooleanOption(
            new SlashCommandBooleanOption()
              .setName("value")
              .setDescription("Enabled or disabled")
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
    await this.ensureUserSettings(interaction.user.id);
    const option = interaction.options.getString("option", true);
    const newValue = interaction.options.getString("value", true);

    if (option == "timezone" && !timezone.default.some(e => e.tzCode == newValue))
      return interaction.editReply(
        `The provided timezone is not valid. See https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for details (make sure to use the \`TZ identified\`!) - Case sensitive!`
      );

    let data: { timezone: string } | { dailyDmTime: string };
    if (option == "timezone") data = { timezone: newValue };
    else data = { dailyDmTime: newValue };

    await this.client.db.userSettings
      .update({
        where: { id: BigInt(interaction.user.id) },
        data
      })
      .catch(err => {
        return interaction.editReply(`Something went wrong while updating your settings: ${err}`);
      });

    return interaction.editReply("Successfully edited your settings!");
  }

  public async list(interaction: ChatInputCommandInteraction) {
    const settings = await this.ensureUserSettings(interaction.user.id);
    interaction.editReply(`Here are your current settings:
Daily DM time: \`${settings.dailyDmTime}\`
Daily DM enabled: \`${settings.dailyDmEnabled}\`
Timezone: \`${settings.timezone}\``);
  }

  public async toggledaily(interaction: ChatInputCommandInteraction) {
    await this.ensureUserSettings(interaction.user.id);
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
        await interaction.editReply(`Something went wrong while updating your settings: ${err}`);
        return;
      });

    if (!updated) return;
    const toggled = updated.dailyDmEnabled == true ? "enabled" : "disabled";
    return interaction.editReply(`Successfully toggled Daily DMs to \`${toggled}\`.`);
  }

  public async ensureUserSettings(id: string) {
    let settings = await this.client.db.userSettings.findUnique({
      where: { id: BigInt(id) }
    });

    if (!settings) {
      settings = await this.client.db.userSettings.create({
        data: {
          id: BigInt(id)
        }
      });
    }

    return settings;
  }
}
