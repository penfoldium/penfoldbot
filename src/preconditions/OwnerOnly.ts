import { Precondition } from "@sapphire/framework";
import type { CommandInteraction } from "discord.js";
import { User } from "discord.js";

export class OwnerOnlyPrecondition extends Precondition {
  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.client.application) {
      return this.error({ message: "Something went wrong." });
    }

    await interaction.client.application.fetch();

    // If the application owner is a user, then create an array that contains the id of said user
    // Otherwise, create an array containing the ids of all the owners
    const owners =
      interaction.client.application.owner instanceof User
        ? [interaction.client.application.owner.id]
        : Array.from(
            interaction.client.application.owner?.members.values() ?? []
          ).map((member) => member.user.id);

    if (owners.includes(interaction.user.id)) {
      return this.ok();
    } else {
      return this.error({ message: "Only bot owners can use this command." });
    }
  }
}

declare module "@sapphire/framework" {
  interface Preconditions {
    OwnerOnly: never;
  }
}
