import { Events, REST, Routes } from "discord.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldEvent } from "../Classes/PenfoldEvent.js";

export default class extends PenfoldEvent {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "RefreshCommands",
      event: Events.ClientReady,
      once: true,
    });
  }

  public async run(client: PenfoldClient) {
    const rest = new REST().setToken(process.env["TOKEN"]!);
    if (this.client.dev && !process.env["GUILD_ID"])
      throw new Error(
        "You cannot use Penfold with the development env variable unless you specify a guild id."
      );

    try {
      console.log(
        `[RefreshCommands] Started refreshing ${client.commands.size} application (/) commands.`
      );

      const commands = this.client.commands.map((command) =>
        command.builder.toJSON()
      );

      const data = await rest.put(
        this.client.dev
          ? Routes.applicationGuildCommands(
              process.env["CLIENT_ID"]!,
              process.env["GUILD_ID"]!
            )
          : Routes.applicationCommands(process.env["CLIENT_ID"]!),
        {
          body: commands,
        }
      );

      console.log(
        // @ts-expect-error
        `[RefreshCommands] Refreshed ${data.length} application (/) commands${
          this.client.dev
            ? ` (in guild with ID ${process.env["GUILD_ID"]})`
            : ""
        }`
      );
    } catch (error) {
      console.error(
        `[RefreshCommands] Something went wrong when refreshing commands: ${error}`
      );
    }
  }
}
