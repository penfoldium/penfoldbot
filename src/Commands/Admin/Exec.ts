import {
  AttachmentBuilder,
  codeBlock,
  SlashCommandNumberOption,
  SlashCommandStringOption,
  type ChatInputCommandInteraction
} from "discord.js";
import ms from "ms";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";

const execPromise = promisify(exec);

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "exec",
      description: "Execute commands on the system (⚠️ WARNING: USE WITH CAUTION)",
      ownerOnly: true
    });

    this.builder
      .addStringOption(
        new SlashCommandStringOption()
          .setName("str")
          .setDescription("String to execute")
          .setRequired(true)
      )
      .addNumberOption(
        new SlashCommandNumberOption()
          .setName("timeout")
          .setDescription("The amount of time in ms for the command to timeout")
          .setRequired(false)
      );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Executing your command...");
    const input = interaction.options.getString("str", true);
    const timeout = interaction.options.getNumber("timeout");

    const start = performance.now();
    const result = await execPromise(input, {
      timeout: timeout ?? 60000
    }).catch(error => ({ stdout: null, stderr: error }));
    const output = result.stdout ? `**\`OUTPUT\`**${codeBlock("prolog", result.stdout)}` : "";
    const outerr = result.stderr ? `**\`ERROR\`**${codeBlock("prolog", result.stderr)}` : "";
    const end = performance.now();

    const attachment =
      [output, outerr].join("\n").length > 1900
        ? new AttachmentBuilder(Buffer.from([output, outerr].join("\n"))).setName("result.txt")
        : false;

    if (!attachment)
      await interaction.editReply({
        content:
          ([output, outerr].join("\n") || "Done. There was no output to stdout or stderr.") +
          `\nTook: ${ms(Number((end - start).toFixed(2)))} to execute ⌛`
      });
    else
      await interaction.editReply({
        content:
          "Result too long, attacked as file instead." +
          `\nTook: ${ms(Number((end - start).toFixed(2)))} to execute ⌛`,
        files: [attachment]
      });
  }
}
