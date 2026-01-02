import dayjs from "dayjs";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldTask } from "../Classes/PenfoldTask.js";

export default class extends PenfoldTask {
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

    const remindersToFire = reminders.filter(reminder => dayjs(reminder.date).diff() < 1);

    // If there are reminders with less than 1 minute remaining, mark them as triggered and send them using a setTimeout
    const remindersOneMinute = reminders.filter(
      reminder =>
        dayjs(reminder.date).diff(dayjs(), "minute") < 1 && !remindersToFire.includes(reminder)
    );

    for (const reminder of remindersOneMinute) {
      await this.client.db.reminders.update({
        where: {
          id: reminder.id
        },
        data: {
          triggered: true
        }
      });

      setTimeout(
        async () => {
          await this.sendReminder(reminder);
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
