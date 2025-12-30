import { Events, Team, type Interaction } from "discord.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldEvent } from "../Classes/PenfoldEvent.js";

export default class extends PenfoldEvent {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "InteractionCreate",
      event: Events.InteractionCreate,
    });
  }

  public async run(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = this.client.commands.get(interaction.commandName);

    if (command?.ownerOnly && !(await this.#isOwner(interaction))) {
      return interaction.reply("This is an owner only command.");
    }

    if (!command)
      return interaction.reply(
        `No command with the name of ${interaction.commandName} found in code.`
      );

    this.client.debug(
      `Command ${interaction.commandName} ran by user ${interaction.user.username}`
    );

    return command.run(interaction);
  }

  async #isOwner(interaction: Interaction) {
    const application = await interaction.client.application.fetch();
    const isTeam = Object.hasOwn(application, "members");
    const owners = [];

    if (isTeam) {
      (application.owner as Team).members.forEach((owner) =>
        owners.push(owner.id)
      );
    } else {
      owners.push(application.owner?.id);
    }

    return owners.includes(interaction.user.id);
  }
}
