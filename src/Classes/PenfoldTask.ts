import i18next from "i18next";
import type { ScheduledTask } from "node-cron";
import { schedule, validate } from "node-cron";
import { PenfoldBase, type BaseOptions } from "./PenfoldBase.js";
import { type PenfoldClient } from "./PenfoldClient.js";

export abstract class PenfoldTask extends PenfoldBase {
  cron: string;
  scheduler?: ScheduledTask;
  clientReady: boolean;

  constructor(client: PenfoldClient, options: TaskOptions) {
    super(client, options);

    if (!validate(options.cron)) throw new Error(i18next.t("errors:INVALID_CRON"));
    this.cron = options.cron;
    this.clientReady = options.clientReady ?? false;
  }

  setup() {
    this.scheduler = schedule(
      this.cron,
      async () => {
        if (this.clientReady && !this.client.isReady()) return;
        this.client.debug(i18next.t("client:RUNNING_TASK", { name: this.name }));
        await this.run();
      },
      { noOverlap: true }
    );

    this.scheduler?.execute();
  }
}

export type TaskOptions = BaseOptions & {
  cron: string;
  /**
   * Only run this task if the client is ready
   */
  clientReady?: boolean;
};
