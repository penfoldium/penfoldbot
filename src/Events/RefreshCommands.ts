import { Collection, Events, REST, Routes } from "discord.js";
import type { PenfoldCommand } from "src/Classes/PenfoldCommand.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldEvent } from "../Classes/PenfoldEvent.js";

export default class extends PenfoldEvent {
  rest = new REST().setToken(process.env["TOKEN"]!);
  guild = process.env["GUILD_ID"];
  id: string = "";

  constructor(client: PenfoldClient) {
    super(client, {
      name: "RefreshCommands",
      event: Events.ClientReady,
      once: true,
    });
  }

  public async run(client: PenfoldClient) {
    this.id = client.user?.id!;

    if (this.client.dev && !this.guild)
      throw new Error(
        "You cannot use Penfold with the development env variable unless you specify a guild id."
      );

    const allCommands = this.client.commands;

    const commands = allCommands.filter((command) => !command.ownerOnly);

    if (allCommands.size > commands.size && this.guild) {
      await this.#refreshOwnerCommands(allCommands);
      // If we're in development mode, then running refreshCommands would have the same effect as refreshOwnerCommands
      if (this.client.dev) return;
    }

    await this.#refreshCommands(commands);
  }

  async #refreshCommands(commands: Collection<string, PenfoldCommand>) {
    try {
      console.log(
        `[RefreshCommands] Started refreshing ${commands.size} application (/) commands.`
      );

      const data = await this.rest.put(Routes.applicationCommands(this.id!), {
        body: commands.map((command) => command.builder.toJSON()),
      });

      console.log(
        // @ts-expect-error
        `[RefreshCommands] Refreshed ${data.length} application (/) commands`
      );
    } catch (error) {
      console.error(
        `[RefreshCommands] Something went wrong when refreshing commands: ${error}`
      );
    }
  }

  async #refreshOwnerCommands(commands: Collection<string, PenfoldCommand>) {
    try {
      console.log(
        `[RefreshCommandsOwnerServer] Started refreshing ${commands.size} application (/) commands in guild id ${this.guild}`
      );

      const data = await this.rest.put(
        Routes.applicationGuildCommands(this.id!, this.guild!),
        {
          body: commands.map((command) => command.builder.toJSON()),
        }
      );

      console.log(
        // @ts-expect-error
        `[RefreshCommandsOwnerServer] Refreshed ${data.length} application (/) commands in guild id ${this.guild}`
      );
    } catch (error) {
      console.error(
        `[RefreshCommandsOwnerServer] Something went wrong when refreshing admin commands: ${error}`
      );
    }
  }
}
