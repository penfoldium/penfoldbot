import dayjs from "dayjs";
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

      let dm = await user.dmChannel?.fetch();
      if (!dm) dm = await user.createDM();
      await dm.send(
        `You wanted me to remind you about this: \`${reminder.message}\`\nYou can snooze this reminder using the \`/reminder snooze ${reminder.id}\` command!`
      );

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
