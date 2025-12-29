import type { ClientEvents } from "discord.js";
import { PenfoldBase, type BaseOptions } from "./PenfoldBase.js";
import { type PenfoldClient } from "./PenfoldClient.js";

export abstract class PenfoldEvent extends PenfoldBase {
  event: keyof ClientEvents;
  once: boolean;

  constructor(client: PenfoldClient, options: EventOptions) {
    super(client, options);
    this.event = options.event;
    this.once = options.once ?? false;

    this.#setup();
  }

  #setup() {
    if (this.once)
      this.client.once(this.event, (...args) => {
        this.run(...args);
      });
    else
      this.client.on(this.event, (...args) => {
        this.run(...args);
      });
  }

  abstract override run(...args: any[]): any;
}

export type EventOptions = BaseOptions & {
  event: keyof ClientEvents;
  once?: boolean;
};
