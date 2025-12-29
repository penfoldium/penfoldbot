import { ActivityType, Client, Events } from "discord.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldEvent } from "../Classes/PenfoldEvent.js";

export default class extends PenfoldEvent {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "Ready",
      event: Events.ClientReady,
    });
  }

  public async run(client: Client<true>) {
    client.user.setActivity(`Danger Mouse`, {
      type: ActivityType.Watching,
    });

    client.user.setStatus("dnd");

    console.log(
      `[Ready] Successfully logged in as ${client.user.tag}. Ready to serve ${client.guilds.cache.size} guilds with a total of ${client.users.cache.size} users.`
    );
  }
}
