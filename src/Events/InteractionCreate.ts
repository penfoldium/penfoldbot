import dayjs from "dayjs";
import { ChatInputCommandInteraction, Events, type Interaction } from "discord.js";
import type { PenfoldCommand } from "src/Classes/PenfoldCommand.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldEvent } from "../Classes/PenfoldEvent.js";

export default class extends PenfoldEvent {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "InteractionCreate",
      event: Events.InteractionCreate
    });
  }

  public async run(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = this.client.commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply(
        `No command with the name of ${interaction.commandName} found in code.`
      );
      return;
    }

    const user = interaction.user.id;
    const isOwner = this.client.owners.includes(interaction.user.id);

    if (command?.ownerOnly && !isOwner) {
      await interaction.reply("This is an owner only command.");
      return;
    }

    const cooldown = isOwner ? false : await this.#checkCooldown(command, user, interaction);

    this.client.debug(
      `Command ${interaction.commandName} ran by user ${interaction.user.username}`
    );

    if (!cooldown) command.run(interaction);
  }

  async #checkCooldown(
    command: PenfoldCommand,
    user: string,
    interaction: ChatInputCommandInteraction
  ) {
    if (command.cooldown <= 0) return false;

    if (!command.hasCooldown(user)) {
      command.addCooldown(user, dayjs().add(command.cooldown, "seconds").toDate());

      return false;
    }

    const cooldown = command.getCooldown(user);
    const remaining = dayjs(cooldown).diff(new Date());

    // If the cooldown expired, remove it.
    if (remaining < 1) {
      command.removeCooldown(user);
      return false;
    }

    await interaction.reply(
      `You're running this command too fast! You can run it again in <t:${dayjs(
        cooldown
      ).unix()}:R>!`
    );

    return true;
  }
}
