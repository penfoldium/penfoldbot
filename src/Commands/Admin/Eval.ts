import {
  AttachmentBuilder,
  codeBlock,
  SlashCommandBooleanOption,
  SlashCommandStringOption,
  type ChatInputCommandInteraction,
} from "discord.js";
import ms from "ms";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "eval",
      description: "Execute JS (⚠️ WARNING: USE WITH CAUTION)",
      ownerOnly: true,
    });

    this.builder
      .addStringOption(
        new SlashCommandStringOption()
          .setName("str")
          .setDescription("String to evaluate")
          .setRequired(true)
      )
      .addBooleanOption(
        new SlashCommandBooleanOption()
          .setName("async")
          .setDescription(
            "Whether or not to await the eval - make sure to use a `return` statement!"
          )
          .setRequired(false)
      );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Evaluating your input...");
    const input = interaction.options.getString("str", true);
    const async = interaction.options.getBoolean("async");

    const start = performance.now();
    let result;
    try {
      result = async
        ? await eval(`async function input() {${input}}; input();`)
        : eval(input);
    } catch (error) {
      result = `Something went wrong: ${codeBlock(error as string)}`;
    }
    const end = performance.now();

    const attachment =
      result && result.length > 1900
        ? new AttachmentBuilder(Buffer.from(result as string)).setName(
            "result.txt"
          )
        : false;

    if (!attachment)
      await interaction.editReply({
        content:
          codeBlock("js", result ?? "No output.") +
          `\nTook: ${ms(Number((end - start).toFixed(2)))} to evaluate ⌛`,
      });
    else
      await interaction.editReply({
        content:
          "Result too long, attacked as file instead." +
          `\nTook: ${ms(Number((end - start).toFixed(2)))} to evaluate ⌛`,
        files: [attachment],
      });
  }
}
