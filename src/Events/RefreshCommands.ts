import { Collection, Events, REST, Routes } from "discord.js";
import i18next from "i18next";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import type { PenfoldCommand } from "../Classes/PenfoldCommand.js";
import { PenfoldEvent } from "../Classes/PenfoldEvent.js";

export default class extends PenfoldEvent {
  rest = new REST().setToken(process.env["TOKEN"]!);
  guild = process.env["GUILD_ID"];
  id: string = "";

  constructor(client: PenfoldClient) {
    super(client, {
      name: "RefreshCommands",
      event: Events.ClientReady,
      once: true
    });
  }

  public async run(client: PenfoldClient) {
    this.id = client.user!.id!;

    if (this.client.dev && !this.guild) throw new Error(i18next.t("errors:NO_DEV_WITHOUT_GUILD"));

    const allCommands = this.client.commands;

    const commands = allCommands.filter(command => !command.ownerOnly);

    if (this.client.dev) {
      await this.#refreshOwnerCommands(allCommands);
      return;
    }

    if (allCommands.size > commands.size && this.guild) {
      await this.#refreshOwnerCommands(allCommands);
    }

    await this.#refreshCommands(commands);
  }

  async #refreshCommands(commands: Collection<string, PenfoldCommand>) {
    try {
      console.log(i18next.t("client:refreshcommands.started", { size: commands.size }));

      const data = await this.rest.put(Routes.applicationCommands(this.id!), {
        body: commands.map(command => command.builder.toJSON())
      });

      console.log(
        // @ts-expect-error As far as I know discord.js doesn't provide typings for this
        i18next.t("refreshcommands.refreshed", { ns: "client", size: data.length })
      );
    } catch (error) {
      console.error(i18next.t("client:refreshcommands.error", { error }));
    }
  }

  async #refreshOwnerCommands(commands: Collection<string, PenfoldCommand>) {
    try {
      console.log(
        i18next.t("client:refreshcommandsownerserver.started", {
          size: commands.size,
          id: this.guild
        })
      );

      const data = await this.rest.put(Routes.applicationGuildCommands(this.id!, this.guild!), {
        body: commands.map(command => command.builder.toJSON())
      });

      console.log(
        i18next.t("client:refreshcommandsownerserver.refreshed", {
          // @ts-expect-error As far as I know discord.js doesn't provide typings for this
          size: data.length,
          id: this.guild
        })
      );
    } catch (error) {
      console.error(i18next.t("client:refreshcommandsownerserver.error", { error }));
    }
  }
}
