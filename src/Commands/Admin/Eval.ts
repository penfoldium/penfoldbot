import { AttachmentBuilder, codeBlock, type ChatInputCommandInteraction } from "discord.js";
import ms from "ms";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import {
  PenfoldSlashCommandBooleanOption,
  PenfoldSlashCommandStringOption
} from "../../Classes/PenfoldSlashCommandBuilders.js";
import { getLocaleString } from "../../Util/Helpers.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "eval.name",
      description: "eval.description",
      ownerOnly: true
    });

    this.builder
      .addStringOption(
        new PenfoldSlashCommandStringOption()
          .localizeName("eval.options.str.name")
          .localizeDescription("eval.options.str.description")
          .setRequired(true)
      )
      .addBooleanOption(
        new PenfoldSlashCommandBooleanOption()
          .localizeName("eval.options.async.name")
          .localizeDescription("eval.options.str.description")
          .setRequired(false)
      );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    await interaction.reply(getLocaleString("eval.strings.evaluating", interaction));
    const input = interaction.options.getString("str", true);
    const async = interaction.options.getBoolean("async");

    const start = performance.now();

    let result;
    try {
      result = async ? await eval(`async function input() {${input}}; input();`) : eval(input);
    } catch (error) {
      result = getLocaleString("eval.strings.went_wrong", interaction, {
        error: codeBlock(error as string)
      });
    }

    const end = performance.now();

    const attachment =
      result && result.length > 1900
        ? new AttachmentBuilder(Buffer.from(result as string)).setName("result.txt")
        : false;

    const took = getLocaleString("eval.strings.took", interaction, {
      time: ms(Number((end - start).toFixed(2)))
    });

    if (!attachment)
      await interaction.editReply({
        content:
          codeBlock("js", result ?? getLocaleString("eval.strings.no_output", interaction)) +
          "\n" +
          took
      });
    else
      await interaction.editReply({
        content: getLocaleString("eval.strings.result_too_long", interaction) + "\n" + took,
        files: [attachment]
      });
  }
}
