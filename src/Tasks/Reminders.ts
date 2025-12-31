import dayjs from "dayjs";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldTask } from "../Classes/PenfoldTask.js";

export default class extends PenfoldTask {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "Reminders",
      cron: "* * * * *"
    });
  }

  public async run() {
    let reminders = await this.client.db.reminders.findMany({
      where: {
        triggered: false
      }
    });
    reminders = reminders.filter(reminder => dayjs(reminder.date).diff() < 1);

    if (!reminders) return;
    reminders.forEach(async reminder => {
      const user = await this.client.users
        .fetch(reminder.user_id.toString())
        .catch(err =>
          this.client.debug(`Something went wrong when fetching reminder user: ${err}`)
        );
      if (!user) return;

      const snooze5 = new ButtonBuilder()
        .setCustomId(`snooze5-${reminder.id}`)
        .setLabel("Snooze 5 minutes")
        .setStyle(ButtonStyle.Primary);
      const snooze10 = new ButtonBuilder()
        .setCustomId(`snooze10-${reminder.id}`)
        .setLabel("Snooze 10 minutes")
        .setStyle(ButtonStyle.Primary);
      const snooze30 = new ButtonBuilder()
        .setCustomId(`snooze30-${reminder.id}`)
        .setLabel("Snooze 30 minutes")
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
    });
  }
}
