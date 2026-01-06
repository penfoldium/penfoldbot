import dayjs from "dayjs";
import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import parse from "parse-duration";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import {
  PenfoldSlashCommandBooleanOption,
  PenfoldSlashCommandNumberOption,
  PenfoldSlashCommandStringOption,
  PenfoldSlashCommandSubcommandBuilder
} from "../../Classes/PenfoldSlashCommandBuilders.js";
import { getLocaleString } from "../../Util/Helpers.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "reminder.name",
      description: "reminder.description"
    });

    this.builder
      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("reminder.subcommands.add.name")
          .localizeDescription("reminder.subcommands.add.description")

          .addStringOption(
            new PenfoldSlashCommandStringOption()
              .localizeName("reminder.subcommands.add.options.when.name")
              .localizeDescription("reminder.subcommands.add.options.when.description")
              .setRequired(true)
          )
          .addStringOption(
            new PenfoldSlashCommandStringOption()
              .localizeName("reminder.subcommands.add.options.reminder.name")
              .localizeDescription("reminder.subcommands.add.options.reminder.description")
              .setRequired(true)
          )
      )

      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("reminder.subcommands.list.name")
          .localizeDescription("reminder.subcommands.list.description")
          .addBooleanOption(
            new PenfoldSlashCommandBooleanOption()
              .localizeName("reminder.subcommands.list.options.inactive.name")
              .localizeDescription("reminder.subcommands.list.options.inactive.description")
          )
      )

      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("reminder.subcommands.delete.name")
          .localizeDescription("reminder.subcommands.delete.description")
          .addNumberOption(
            new PenfoldSlashCommandNumberOption()
              .localizeName("reminder.subcommands.delete.options.id.name")
              .localizeDescription("reminder.subcommands.delete.options.id.description")
              .setRequired(true)
          )
      )

      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("reminder.subcommands.snooze.name")
          .localizeDescription("reminder.subcommands.snooze.description")
          .addNumberOption(
            new PenfoldSlashCommandNumberOption()
              .localizeName("reminder.subcommands.snooze.options.id.name")
              .localizeDescription("reminder.subcommands.snooze.options.id.description")
              .setRequired(true)
          )
          .addStringOption(
            new PenfoldSlashCommandStringOption()
              .localizeName("reminder.subcommands.snooze.options.time.name")
              .localizeDescription("reminder.subcommands.snooze.options.time.description")
              .setRequired(true)
          )
      );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply();
    switch (subcommand) {
      case "add":
        this.add(interaction);
        break;
      case "list":
        this.list(interaction);
        break;
      case "delete":
        this.delete(interaction);
        break;
      case "snooze":
        this.snooze(interaction);
        break;
    }
  }

  public async add(interaction: ChatInputCommandInteraction) {
    const whenInput = interaction.options.getString("when", true);
    let when;
    if (dayjs(whenInput).isValid()) {
      when = dayjs(whenInput).diff();
    } else when = parse(whenInput);

    const reminder = interaction.options.getString("reminder", true);
    if (!when) {
      await interaction.editReply(
        getLocaleString("reminder.strings.invalid_duration", interaction)
      );
      return;
    }

    if (when < 1) {
      await interaction.editReply(getLocaleString("reminder.strings.past_duration", interaction));
      return;
    }

    const created = await this.client.db.reminders
      .create({
        data: {
          user_id: BigInt(interaction.user.id),
          channel_id: interaction.channel ? BigInt(interaction.channel.id) : null,
          date: dayjs().add(when, "ms").toDate(),
          message: reminder,
          locale: interaction.locale,
          triggered: false
        }
      })
      .catch(err => {
        interaction.editReply(
          getLocaleString("reminder.strings.create_error", interaction, { err })
        );
      });

    if (!created) return;
    await interaction.editReply(
      getLocaleString(
        interaction.channel
          ? "reminder.strings.create_success_channel"
          : "reminder.strings.create_success",
        interaction,
        {
          id: created.id,
          date: dayjs(created.date).unix(),
          channelId: created.channel_id?.toString() || ""
        }
      )
    );
    const task = this.client.tasks.get("Reminders");
    if (task) await task.run();
  }

  public async list(interaction: ChatInputCommandInteraction) {
    const inactive = interaction.options.getBoolean("inactive");
    const reminders = await this.client.db.reminders.findMany({
      where: {
        user_id: BigInt(interaction.user.id)
      }
    });

    if (!reminders.length) {
      await interaction.editReply(getLocaleString("reminder.strings.list_empty", interaction));
      return;
    }

    if (reminders.filter(reminder => !reminder.triggered).length < 1 && !inactive) {
      await interaction.editReply(
        getLocaleString("reminder.strings.list_none_active", interaction)
      );
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: getLocaleString(
          inactive ? "reminder.strings.list_all_title" : "reminder.strings.list_active_title",
          interaction,
          { user: interaction.user.username }
        ),
        iconURL: interaction.user.displayAvatarURL()
      })
      .setDescription(
        reminders
          .filter(reminder => inactive || !reminder.triggered)
          .map(
            reminder =>
              getLocaleString("reminder.strings.list_item", interaction, {
                id: reminder.id,
                message: reminder.message,
                date: dayjs(reminder.date).unix()
              }) +
              (inactive
                ? getLocaleString("reminder.strings.list_item_active", interaction, {
                    active: !reminder.triggered
                  })
                : "")
          )
          .join("\n\n")
          .slice(0, 4096)
      )
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  public async delete(interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getNumber("id", true);
    const exists = await this.client.db.reminders.findUnique({
      where: {
        id
      }
    });

    if (exists && exists.user_id !== BigInt(interaction.user.id)) {
      await interaction.editReply(
        getLocaleString("reminder.strings.delete_others_reminder", interaction)
      );
      return;
    }

    if (!exists) {
      await interaction.editReply(
        getLocaleString("reminder.strings.reminder_not_found", interaction)
      );
      return;
    }

    await this.client.db.reminders
      .delete({
        where: {
          id: exists.id
        }
      })
      .catch(async err => {
        await interaction.editReply(
          getLocaleString("reminder.strings.delete_error", interaction, { err })
        );
        return;
      })
      .finally(async () => {
        await interaction.editReply(
          getLocaleString("reminder.strings.delete_success", interaction, { id })
        );
        return;
      });
  }

  public async snooze(interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getNumber("id", true);
    const time = interaction.options.getString("time", true);
    let snoozeFor;
    if (dayjs(time).isValid()) {
      snoozeFor = dayjs(time).diff();
    } else snoozeFor = parse(time);

    if (!snoozeFor) {
      await interaction.editReply(
        getLocaleString("reminder.strings.snooze_invalid_time", interaction)
      );
      return;
    }

    if (snoozeFor < 1) {
      interaction.editReply(getLocaleString("reminder.strings.snooze_past", interaction));
      return;
    }

    const updated = await this.client.db.reminders
      .update({
        where: {
          id
        },
        data: {
          date: dayjs().add(snoozeFor, "ms").toDate(),
          triggered: false
        }
      })
      .catch(async err => {
        await interaction.editReply(
          getLocaleString("reminder.strings.snooze_error", interaction, { err })
        );
        return null;
      });

    if (updated) {
      await interaction.editReply(
        getLocaleString("reminder.strings.snooze_success", interaction, {
          id,
          date: dayjs(updated?.date).unix()
        })
      );
    }
  }
}
