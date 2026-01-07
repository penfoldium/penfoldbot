import dayjs from "dayjs";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Collection
} from "discord.js";
import i18next from "i18next";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldTask } from "../Classes/PenfoldTask.js";
import { getLocaleString } from "../Util/Helpers.js";

export default class extends PenfoldTask {
  toSend: Collection<number, boolean> = new Collection();

  constructor(client: PenfoldClient) {
    super(client, {
      name: "Reminders",
      cron: "* * * * *",
      clientReady: true
    });
  }

  public async run() {
    const reminders = await this.client.db.reminders.findMany({
      where: {
        triggered: false
      }
    });

    const remindersToFire = reminders.filter(
      reminder => dayjs(reminder.date).diff() < 1 && !this.toSend.has(reminder.id)
    );

    // If there are reminders with less than 1 minute remaining, add them to a Collection and send them using a setTimeout
    const remindersOneMinute = reminders.filter(
      reminder =>
        dayjs(reminder.date).diff(dayjs(), "minute") < 1 &&
        !remindersToFire.includes(reminder) &&
        !this.toSend.has(reminder.id)
    );

    for (const reminder of remindersOneMinute) {
      this.toSend.set(reminder.id, true);

      setTimeout(
        async () => {
          await this.sendReminder(reminder);
          await this.client.db.reminders.update({
            where: {
              id: reminder.id
            },
            data: {
              triggered: true
            }
          });

          this.toSend.delete(reminder.id);
        },
        // We use Math.abs() here to convert negative number to positive
        Math.abs(dayjs().diff(reminder.date))
      );
    }

    if (!remindersToFire) return;

    remindersToFire.forEach(async reminder => {
      await this.sendReminder(reminder);
    });
  }

  async sendReminder(reminder: {
    id: number;
    user_id: bigint;
    channel_id: bigint | null;
    date: Date;
    message: string;
    triggered: boolean;
    locale: string;
  }) {
    const user = await this.client.users
      .fetch(reminder.user_id.toString())
      .catch(err =>
        this.client.debug(i18next.t("client:debug.reminder.fetch.user_error", { error: err }))
      );
    if (!user) return;

    const interaction = {
      locale: reminder.locale
    };

    const snooze5 = new ButtonBuilder()
      .setCustomId(`snooze15-${reminder.id}-${user.id}`)
      .setLabel(getLocaleString("snooze.snooze_15", interaction as ChatInputCommandInteraction))
      .setStyle(ButtonStyle.Primary);
    const snooze10 = new ButtonBuilder()
      .setCustomId(`snooze60-${reminder.id}-${user.id}`)
      .setLabel(getLocaleString("snooze.snooze_60", interaction as ChatInputCommandInteraction))
      .setStyle(ButtonStyle.Primary);
    const snooze30 = new ButtonBuilder()
      .setCustomId(`snooze1440-${reminder.id}-${user.id}`)
      .setLabel(getLocaleString("snooze.snooze_1440", interaction as ChatInputCommandInteraction))
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(snooze5, snooze10, snooze30);

    let dm = await user.dmChannel?.fetch();
    if (!dm) dm = await user.createDM();
    const content = getLocaleString(
      "reminder.strings.content",
      interaction as ChatInputCommandInteraction,
      { message: reminder.message }
    );

    await dm.send({
      content,
      components: [row]
    });

    if (reminder.channel_id) {
      const channel = await this.client.channels
        .fetch(reminder.channel_id.toString())
        .catch(() => null);

      if (channel?.isTextBased() && channel.isSendable()) {
        await channel
          .send({
            content: `<@${reminder.user_id}> ` + content,
            components: [row]
          })
          .catch(() => null);
      }
    }

    await this.client.db.reminders.update({
      where: {
        id: reminder.id
      },
      data: {
        triggered: true
      }
    });
  }
}
