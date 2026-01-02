import dayjs from "dayjs";
import { EmbedBuilder } from "discord.js";
import ms from "ms";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldTask } from "../Classes/PenfoldTask.js";

export default class extends PenfoldTask {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "DailyDM",
      cron: "* * * * *",
      clientReady: true
    });
  }

  public async run() {
    const dailydm = await this.client.db.userSettings.findMany({
      where: {
        dailyDmEnabled: true
      }
    });

    function filter(daily: {
      id: bigint;
      timezone: string;
      dailyDmTime: string;
      dailyDmEnabled: boolean;
    }) {
      const [hour, minute] = daily.dailyDmTime.split(":");
      const day = dayjs()
        .tz(daily.timezone)
        .set("hours", Number(hour))
        .set("minutes", Number(minute))
        .set("seconds", 0);
      return day.diff() <= 10 && day.diff() >= -10;
    }

    const toFire = dailydm.filter(filter);
    if (!toFire) return;

    for (const daily of toFire) {
      await this.sendDaily(daily);
    }
  }

  async sendDaily(daily: {
    id: bigint;
    timezone: string;
    dailyDmTime: string;
    dailyDmEnabled: boolean;
  }) {
    const user = await this.client.users
      .fetch(daily.id.toString())
      .catch(err => this.client.debug(`Something went wrong when fetching user (dailydm): ${err}`));
    if (!user) return;

    const reminders = await this.client.db.reminders
      .findMany({
        where: {
          user_id: daily.id,
          triggered: false
        }
      })
      .catch(() => {});

    const todos = await this.client.db.todos.findMany({
      where: {
        user_id: daily.id
      }
    });

    if (!reminders) return;

    const filteredReminders = reminders.filter(reminder => {
      return dayjs().diff(reminder.date, "days") == 0;
    });

    if (!filteredReminders.length && (!todos || !todos.length)) return;

    let fields = [];

    for (const reminder of filteredReminders) {
      fields.push({
        name: `Reminder \`${reminder.id}\` (due in ${ms(Math.abs(dayjs().tz(daily.timezone).diff(reminder.date)), { long: true })})`,
        value: `\`${reminder.message.slice(0, 1024)}\``
      });
    }

    for (const todo of todos) {
      fields.push({
        name: `Todo \`${todo.id}\``,
        value: `\`${todo.todo.slice(0, 1024)}\``
      });
    }

    let warning: string | null = null;
    if (fields.length >= 24) {
      fields = fields.slice(0, 24);
      warning =
        "⚠️ Can only display a total of 25 reminders and todos. Make sure to clean them up!";
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: `Daily DM for ${user.username}`, iconURL: user.displayAvatarURL() })
      .setDescription(warning)
      .setFields(fields);

    let dm = await user.dmChannel?.fetch();
    if (!dm) dm = await user.createDM();
    await dm.send({
      embeds: [embed]
    });
  }
}
