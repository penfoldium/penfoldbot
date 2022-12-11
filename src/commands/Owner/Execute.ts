import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { codeBlock } from "@sapphire/utilities";
import { exec } from "node:child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

@ApplyOptions<Command.Options>({
  description:
    "Execute commands in the terminal, use with EXTREME CAUTION. Times out in 60 seconds by default.",
  preconditions: ["OwnerOnly"],
})
export class ExecuteCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option
              .setName("expression")
              .setDescription("The expression to execute in the terminal")
              .setRequired(true)
          )
          .addIntegerOption((option) =>
            option
              .setName("timeout")
              .setDescription(
                "How long to wait before timing out the process (in seconds)"
              )
          ),
      {
        idHints: [
          // Alex's testing bot
          "105145326451793523",
        ],
      }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputInteraction
  ) {
    await interaction.deferReply({ ephemeral: true });
    const expression = interaction.options.getString("expression", true);

    // Copyright (c) 2017-2019 dirigeants. All rights reserved. MIT license.
    const result = await execPromise(expression, {
      timeout: Time.Second * (interaction.options.getInteger("timeout") ?? 60),
    }).catch((error: string) => ({ stdout: null, stderr: error }));

    const output = result.stdout
      ? `**\`OUTPUT\`**${codeBlock("prolog", result.stdout)}`
      : "";
    const outerr = result.stderr
      ? `**\`ERROR\`**${codeBlock("prolog", result.stderr)}`
      : "";

    return interaction.editReply(
      [output, outerr].join("\n") ??
        "Done. There was no output to stdout or stderr."
    );
  }
}
