import { ActivityType, Client, Events, Team } from "discord.js";
import i18next from "i18next";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldEvent } from "../Classes/PenfoldEvent.js";

export default class extends PenfoldEvent {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "Ready",
      event: Events.ClientReady
    });
  }

  public async run(client: Client<true>) {
    await this.#populateOwners(client);

    client.user.setActivity(`Danger Mouse`, {
      type: ActivityType.Watching
    });

    client.user.setStatus("dnd");

    console.log(
      i18next.t("client:CLIENT_READY", {
        user: client.user.tag,
        guilds: client.guilds.cache.size
      })
    );
  }

  async #populateOwners(client: Client<true>) {
    const application = await client.application.fetch();
    const isTeam = Object.hasOwn(application, "members");

    if (isTeam) {
      (application.owner as Team).members.forEach(owner => this.client.owners.push(owner.id));
    } else {
      const id = application.owner?.id;
      if (!id) return;
      this.client.owners.push(id);
    }
  }
}
