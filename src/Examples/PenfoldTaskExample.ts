import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldTask } from "../Classes/PenfoldTask.js";

export default class extends PenfoldTask {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "CheckReminders",
      cron: "* * * * *"
    });
  }

  public async run(...args: any[]) {
    console.log("hello from tasks! I run every minute");
  }
}
