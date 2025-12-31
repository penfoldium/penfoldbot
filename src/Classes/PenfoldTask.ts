import type { ScheduledTask } from "node-cron";
import { schedule, validate } from "node-cron";
import { PenfoldBase, type BaseOptions } from "./PenfoldBase.js";
import { type PenfoldClient } from "./PenfoldClient.js";

export abstract class PenfoldTask extends PenfoldBase {
  cron: string;
  scheduler?: ScheduledTask;

  constructor(client: PenfoldClient, options: TaskOptions) {
    super(client, options);

    if (!validate(options.cron)) throw new Error("Invalid cron string provided");
    this.cron = options.cron;
  }

  setup() {
    this.scheduler = schedule(
      this.cron,
      async () => {
        this.client.debug(`Running task ${this.name}`);
        await this.run();
      },
      { noOverlap: true }
    );

    this.scheduler?.execute();
  }
}

export type TaskOptions = BaseOptions & {
  cron: string;
};
