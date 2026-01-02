import {
  EmbedBuilder,
  SlashCommandBooleanOption,
  SlashCommandNumberOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  type ChatInputCommandInteraction
} from "discord.js";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "todo",
      description: "Everything todo related"
    });

    this.builder
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("add")
          .setDescription("Add a todo")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("todo")
              .setDescription("What you have todo")
              .setRequired(true)
          )
      )

      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("list")
          .setDescription("See a list of your todos")
          .addBooleanOption(
            new SlashCommandBooleanOption()
              .setName("completed")
              .setDescription("Also view completed todos")
          )
      )

      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("complete")
          .setDescription("Mark a todo as completed")
          .addNumberOption(
            new SlashCommandNumberOption()
              .setName("id")
              .setDescription("The ID of the todo to complete")
              .setRequired(true)
          )
      );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply();
    switch (subcommand) {
      case "add":
        this.add(interaction);
        break;
      case "list":
        this.list(interaction);
        break;
      case "complete":
        this.complete(interaction);
        break;
    }
  }

  public async add(interaction: ChatInputCommandInteraction) {
    const todo = interaction.options.getString("todo", true);

    const created = await this.client.db.todos
      .create({
        data: {
          user_id: BigInt(interaction.user.id),
          todo,
          completed: false
        }
      })
      .catch(err => {
        interaction.editReply(`Something  went wrong when creating your todo: ${err}`);
      });

    if (!created) return;
    await interaction.editReply(`Successfully created todo with the id of \`${created.id}\`.`);
  }

  public async list(interaction: ChatInputCommandInteraction) {
    const completed = interaction.options.getBoolean("completed");
    const todos = await this.client.db.todos.findMany({
      where: {
        user_id: BigInt(interaction.user.id)
      }
    });

    if (!todos.length) {
      await interaction.editReply("You currently don't have any todos.");
      return;
    }

    if (todos.filter(todo => !todo.completed).length < 1 && !completed) {
      await interaction.editReply(
        "You currently don't have any todos. You can also view your completed todos by setting the `View active todos` command option to True!"
      );
      return;
    }

    if (completed) {
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `All todos for ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL()
        })
        .setDescription(
          todos
            .map(
              todo =>
                `Todo ID: **${todo.id}**
Todo: **${todo.todo}**
Completed: **${!todo.completed}**`
            )
            .join("\n\n")
            .slice(0, 4093) + "..."
        )
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Active todos for ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setDescription(
        todos
          .filter(todo => !todo.completed)
          .map(
            todo =>
              `Todo ID: **${todo.id}**
Todo: **${todo.todo}**`
          )
          .join("\n\n")
          .slice(0, 4096)
      )
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  public async complete(interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getNumber("id", true);
    const exists = await this.client.db.todos.findUnique({
      where: {
        id
      }
    });

    if (exists && exists.user_id !== BigInt(interaction.user.id)) {
      await interaction.editReply(
        "You're being a bit naughty, can't mark another user's todo as complete!"
      );
      return;
    }

    if (!exists) {
      await interaction.editReply(
        "I'm sorry, but there doesn't seem to be any todo with that ID in my database."
      );
      return;
    }

    await this.client.db.todos
      .update({
        where: {
          id: exists.id
        },
        data: {
          completed: true
        }
      })
      .catch(async err => {
        await interaction.editReply(`Something went wrong while completing your todo: ${err}`);
        return;
      })
      .finally(async () => {
        await interaction.editReply(`Successfully marked todo \`${id}\` as completed.`);
        return;
      });
  }
}
