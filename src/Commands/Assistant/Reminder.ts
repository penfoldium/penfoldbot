import dayjs from "dayjs";
import {
  EmbedBuilder,
  SlashCommandBooleanOption,
  SlashCommandNumberOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  type ChatInputCommandInteraction
} from "discord.js";
import parse from "parse-duration";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "reminder",
      description: "Everything reminder related"
    });

    this.builder
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("add")
          .setDescription("Add a reminder")

          .addStringOption(
            new SlashCommandStringOption()
              .setName("when")
              .setDescription("When to be reminded")
              .setRequired(true)
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName("reminder")
              .setDescription("What to be reminded of")
              .setRequired(true)
          )
      )

      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("list")
          .setDescription("See a list of your reminders")
          .addBooleanOption(
            new SlashCommandBooleanOption()
              .setName("inactive")
              .setDescription("Also view inactive reminders")
          )
      )

      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("delete")
          .setDescription("Delete a reminder")
          .addNumberOption(
            new SlashCommandNumberOption()
              .setName("id")
              .setDescription("The ID of the reminder to delete")
              .setRequired(true)
          )
      )

      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("snooze")
          .setDescription("Snooze a reminder")
          .addNumberOption(
            new SlashCommandNumberOption()
              .setName("id")
              .setDescription("The ID of the reminder to snooze")
              .setRequired(true)
          )
          .addStringOption(
            new SlashCommandStringOption()
              .setName("time")
              .setDescription("How long to snooze the reminder for")
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
        'Please provide a valid duration. (examples: "in 24 hours", "2h", "two hours" or a date like "2026-06-31")'
      );
      return;
    }

    if (when < 1) {
      await interaction.editReply("You can't create a reminder for the past!");
      return;
    }

    const created = await this.client.db.reminders
      .create({
        data: {
          user_id: BigInt(interaction.user.id),
          date: dayjs().add(when, "ms").toDate(),
          message: reminder,
          triggered: false
        }
      })
      .catch(err => {
        interaction.editReply(`Something  went wrong when creating your reminder: ${err}`);
      });

    if (!created) return;
    await interaction.editReply(
      `Successfully created reminder with the id of \`${
        created.id
      }\`. I will remind you on <t:${dayjs(created.date).unix()}:F>`
    );
  }

  public async list(interaction: ChatInputCommandInteraction) {
    const inactive = interaction.options.getBoolean("inactive");
    const reminders = await this.client.db.reminders.findMany({
      where: {
        user_id: BigInt(interaction.user.id)
      }
    });

    if (!reminders.length) {
      await interaction.editReply("You currently don't have any reminders.");
      return;
    }

    if (reminders.filter(reminder => !reminder.triggered).length < 1 && !inactive) {
      await interaction.editReply(
        "You currently don't have any active reminders. You can also view your inactive reminders by setting the `View active reminders` command option to True!"
      );
      return;
    }

    if (inactive) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `All reminders for ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(
          reminders
            .map(
              reminder =>
                `Reminder ID: **${reminder.id}**
Reminder: **${reminder.message}**
When: **<t:${dayjs(reminder.date).unix()}:F>**
Active: **${!reminder.triggered}**`
            )
            .join("\n\n")
        )
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Active reminders for ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setDescription(
        reminders
          .filter(reminder => !reminder.triggered)
          .map(
            reminder =>
              `Reminder ID: **${reminder.id}**
Reminder: **${reminder.message}**
When: **<t:${dayjs(reminder.date).unix()}:F>**`
          )
          .join("\n\n")
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
        "You're being a bit naughty, don't delete another user's reminder!"
      );
      return;
    }

    if (!exists) {
      await interaction.editReply(
        "I'm sorry, but there doesn't seem to be any reminder with that ID in my database."
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
        await interaction.editReply(`Something went wrong while deleting your reminder: ${err}`);
        return;
      })
      .finally(async () => {
        await interaction.editReply(`Successfully deleted reminder with ID of \`${id}\`.`);
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
      await interaction.editReply("Invalid snooze time provided.");
      return;
    }

    if (snoozeFor < 1) {
      interaction.editReply("You can't snooze a reminder into the past!");
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
        await interaction.editReply(`Something went wrong while snoozing your reminder: ${err}`);
        return null;
      });

    await interaction.editReply(
      `Successfully snoozed reminder with id \`${id}\` to <t:${dayjs(updated?.date).unix()}:F>`
    );
  }
}
