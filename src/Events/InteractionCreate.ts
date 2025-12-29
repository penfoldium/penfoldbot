import { Events, type Interaction } from "discord.js";
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

    if (!command)
      return interaction.reply(
        `No command with the name of ${interaction.commandName} found in code.`
      );

    this.client.debug(
      `Command ${interaction.commandName} ran by user ${interaction.user.username}`
    );

    return command.run(interaction);
  }
}
