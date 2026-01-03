import dayjs from "dayjs";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Collection } from "discord.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldTask } from "../Classes/PenfoldTask.js";

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
    date: Date;
    message: string;
    triggered: boolean;
  }) {
    const user = await this.client.users
      .fetch(reminder.user_id.toString())
      .catch(err => this.client.debug(`Something went wrong when fetching reminder user: ${err}`));
    if (!user) return;

    const snooze5 = new ButtonBuilder()
      .setCustomId(`snooze15-${reminder.id}`)
      .setLabel("Snooze 15 minutes")
      .setStyle(ButtonStyle.Primary);
    const snooze10 = new ButtonBuilder()
      .setCustomId(`snooze60-${reminder.id}`)
      .setLabel("Snooze 1 hour")
      .setStyle(ButtonStyle.Primary);
    const snooze30 = new ButtonBuilder()
      .setCustomId(`snooze1440-${reminder.id}`)
      .setLabel("Snooze 1 day")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(snooze5, snooze10, snooze30);

    let dm = await user.dmChannel?.fetch();
    if (!dm) dm = await user.createDM();
    await dm.send({
      content: `You wanted me to remind you about this:
📝\`${reminder.message}\``,
      components: [row]
    });

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
