import { AttachmentBuilder, codeBlock, type ChatInputCommandInteraction } from "discord.js";
import ms from "ms";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import {
  PenfoldSlashCommandNumberOption,
  PenfoldSlashCommandStringOption
} from "../../Classes/PenfoldSlashCommandBuilders.js";
import { getLocaleString } from "../../Util/Helpers.js";

const execPromise = promisify(exec);

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "exec.name",
      description: "exec.description",
      ownerOnly: true
    });

    this.builder
      .addStringOption(
        new PenfoldSlashCommandStringOption()
          .localizeName("exec.options.str.name")
          .localizeDescription("exec.options.str.description")
          .setRequired(true)
      )
      .addNumberOption(
        new PenfoldSlashCommandNumberOption()
          .localizeName("exec.options.timeout.name")
          .localizeDescription("exec.options.timeout.description")
          .setRequired(false)
      );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    await interaction.reply(getLocaleString("exec.strings.executing", interaction));
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

    const took = getLocaleString("exec.strings.took", interaction, {
      time: ms(Number((end - start).toFixed(2)))
    });

    if (!attachment)
      await interaction.editReply({
        content:
          ([output, outerr].join("\n") ||
            getLocaleString("exec.strings.done_no_output", interaction)) +
          `\n` +
          took
      });
    else
      await interaction.editReply({
        content: getLocaleString("exec.strings.result_too_long", interaction) + `\n` + took,
        files: [attachment]
      });
  }
}
