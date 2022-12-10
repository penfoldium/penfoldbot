import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, ListenerOptions } from "@sapphire/framework";
import type { Client } from "discord.js";

@ApplyOptions<ListenerOptions>({ event: Events.ClientReady })
export class ReadyListener extends Listener {
  public async run(client: Client) {
    if (!client.user) return;

    console.log(
      `Successfully logged in as ${client.user.tag}. Ready to serve ${client.guilds.cache.size} guilds with a total of ${client.users.cache.size} users.`
    );

    await client.user.setActivity("Danger Mouse | /hello", {
      type: "WATCHING",
    });

    await client.user.setStatus("dnd");
  }
}
