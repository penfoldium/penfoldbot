import { Events } from "discord.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldEvent } from "../Classes/PenfoldEvent.js";

export default class extends PenfoldEvent {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "readyEvent",
      event: Events.ClientReady,
      once: false
    });
  }

  public async run(...args: any[]) {
    console.log("hello from ready event!");
  }
}
