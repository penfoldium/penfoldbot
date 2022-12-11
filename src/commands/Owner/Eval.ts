import { ApplyOptions } from "@sapphire/decorators";
import { Command } from "@sapphire/framework";
import { Stopwatch } from "@sapphire/stopwatch";
import { inspect } from "util";

@ApplyOptions<Command.Options>({
  description: "Evaluate a JavaScript expression",
  cooldownDelay: 0,
  preconditions: ["OwnerOnly"],
})
export class EvalCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder //
          .setName(this.name)
          .setDescription(this.description)
          .addStringOption((option) =>
            option
              .setName("expression")
              .setDescription("The expression to evaluate")
              .setRequired(true)
          )
          .addBooleanOption((option) =>
            option
              .setName("async")
              .setDescription(
                "Whether or not this expression should be evaluated asyncronously"
              )
          )
          .addBooleanOption((option) =>
            option
              .setName("inspect")
              .setDescription(
                "Whether or not this expression should be inspected"
              )
          ),
      {
        idHints: [
          // Alex's testing bot
          "1051047522648461342",
        ],
      }
    );
  }

  public override async chatInputRun(
    interaction: Command.ChatInputInteraction
  ) {
    await interaction.deferReply({ ephemeral: true });
    const stopwatch = new Stopwatch();

    const toEval = interaction.options.getString("expression", true);
    let evaled: string;
    try {
      if (interaction.options.getBoolean("async")) {
        evaled = await eval(`(async () => {${toEval}})()`);
      } else evaled = eval(toEval);
    } catch (err) {
      stopwatch.stop();
      return interaction.editReply({
        content: `Error: ${err}\nTook: ${stopwatch.toString()}`,
      });
    }

    stopwatch.stop();

    if (interaction.options.getBoolean("inspect")) {
      evaled = inspect(evaled, undefined);
    }

    evaled = String(evaled);

    if (!evaled.length) {
      return interaction.editReply(
        `The eval didn't return any value!\nTook: ${stopwatch.toString()}`
      );
    }

    if (evaled.length >= 1940) {
      return interaction.editReply({
        content: `Output too long... attached the output in a file!\nTook: ${stopwatch.toString()}`,
        files: [{ name: "output.txt", attachment: Buffer.from(evaled) }],
      });
    }

    return interaction.editReply({
      content: `\`\`\`js\n${evaled}\`\`\`\nTook: ${stopwatch.toString()}`,
    });
  }
}
