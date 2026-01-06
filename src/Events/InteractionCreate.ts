import dayjs from "dayjs";
import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  Events,
  type Interaction
} from "discord.js";
import i18next from "i18next";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import type { PenfoldCommand } from "../Classes/PenfoldCommand.js";
import { PenfoldEvent } from "../Classes/PenfoldEvent.js";
import { getLocaleString } from "../Util/Helpers.js";

export default class extends PenfoldEvent {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "InteractionCreate",
      event: Events.InteractionCreate
    });
  }

  public async run(interaction: Interaction) {
    if (interaction.isAutocomplete()) {
      const command = this.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.autocomplete(interaction);
      } catch {
        return;
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId.startsWith("snooze")) await this.#handleReminders(interaction);
      return;
    }

    if (!interaction.isChatInputCommand()) return;
    const command = this.client.commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply(
        getLocaleString("no_command", interaction, {
          command: interaction.commandName
        })
      );
      return;
    }

    const user = interaction.user.id;
    const isOwner = this.client.owners.includes(interaction.user.id);

    if (command?.ownerOnly && !isOwner) {
      await interaction.reply(getLocaleString("owner_only", interaction));
      return;
    }

    const cooldown = isOwner ? false : await this.#checkCooldown(command, user, interaction);

    this.client.debug(
      i18next.t("client:debug.command_ran", {
        command: interaction.commandName,
        user: interaction.user.username
      })
    );

    if (!cooldown) command.run(interaction);
  }

  async #handleReminders(interaction: ButtonInteraction) {
    await interaction.deferReply();
    const snoozeTime = interaction.customId.split("snooze")[1]?.split("-")[0];
    const userId = interaction.customId.split("-").pop();
    const id = interaction.customId.split("-")[1];
    // Only let the user who created the reminder snooze it
    if (interaction.user.id !== userId) {
      await interaction.editReply(
        getLocaleString("snooze.not_your_reminder", interaction, { user: interaction.user.id })
      );
      return;
    }

    const reminder = await this.client.db.reminders.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!reminder) return;
    const updated = await this.client.db.reminders
      .update({
        where: {
          id: reminder.id
        },
        data: {
          date: dayjs(reminder.date).add(Number(snoozeTime), "minutes").toDate()
        }
      })
      .catch(async err => {
        await interaction.editReply(getLocaleString("snooze.error", interaction, { err }));
        return;
      });

    if (!updated) return;
    await interaction.editReply(
      getLocaleString("snooze.strings.snoozed", interaction, {
        id: updated.id,
        time: dayjs(updated.date).unix()
      })
    );
  }

  async #checkCooldown(
    command: PenfoldCommand,
    user: string,
    interaction: ChatInputCommandInteraction
  ) {
    if (command.cooldown <= 0) return false;

    if (!command.hasCooldown(user)) {
      command.addCooldown(user, dayjs().add(command.cooldown, "seconds").toDate());

      return false;
    }

    const cooldown = command.getCooldown(user);
    const remaining = dayjs(cooldown).diff(new Date());

    // If the cooldown expired, remove it.
    if (remaining < 1) {
      command.removeCooldown(user);
      return false;
    }

    await interaction.reply(
      getLocaleString("cooldown_text", interaction, {
        time: dayjs(cooldown).unix()
      })
    );

    return true;
  }
}
