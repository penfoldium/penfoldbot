import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import {
  PenfoldSlashCommandBooleanOption,
  PenfoldSlashCommandNumberOption,
  PenfoldSlashCommandStringOption,
  PenfoldSlashCommandSubcommandBuilder
} from "../../Classes/PenfoldSlashCommandBuilders.js";
import { getLocaleString } from "../../Util/Helpers.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "todo.name",
      description: "todo.description"
    });

    this.builder
      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("todo.subcommands.add.name")
          .localizeDescription("todo.subcommands.add.description")
          .addStringOption(
            new PenfoldSlashCommandStringOption()
              .localizeName("todo.subcommands.add.options.todo.name")
              .localizeDescription("todo.subcommands.add.options.todo.description")
              .setRequired(true)
          )
      )

      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("todo.subcommands.list.name")
          .localizeDescription("todo.subcommands.list.description")
          .addBooleanOption(
            new PenfoldSlashCommandBooleanOption()
              .localizeName("todo.subcommands.list.options.completed.name")
              .localizeDescription("todo.subcommands.list.options.completed.description")
          )
      )

      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("todo.subcommands.search.name")
          .localizeDescription("todo.subcommands.search.description")
          .addStringOption(
            new PenfoldSlashCommandStringOption()
              .localizeName("todo.subcommands.search.options.search.name")
              .localizeDescription("todo.subcommands.search.options.search.description")
              .setRequired(true)
          )
      )

      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("todo.subcommands.complete.name")
          .localizeDescription("todo.subcommands.complete.description")
          .addNumberOption(
            new PenfoldSlashCommandNumberOption()
              .localizeName("todo.subcommands.complete.options.id.name")
              .localizeDescription("todo.subcommands.complete.options.id.description")
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
      case "search":
        this.search(interaction);
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
        interaction.editReply(getLocaleString("todo.strings.create_error", interaction, { err }));
      });

    if (!created) return;
    await interaction.editReply(
      getLocaleString("todo.strings.create_success", interaction, { id: created.id })
    );
  }

  public async search(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString("search", true);
    const todos = await this.client.db.todos.findMany({
      where: {
        user_id: BigInt(interaction.user.id)
      }
    });

    const filtered = todos.filter(todo => todo.todo.toLowerCase().includes(query));

    if (!filtered.length) {
      await interaction.editReply(getLocaleString("todo.strings.search_not_found", interaction));
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: getLocaleString("todo.strings.search_results_title", interaction, {
          query,
          user: interaction.user.username
        }),
        iconURL: interaction.user.displayAvatarURL()
      })
      .setDescription(
        filtered
          .map(todo =>
            getLocaleString("todo.strings.search_result_item", interaction, {
              id: todo.id,
              todo: todo.todo
            })
          )
          .join("\n\n")
          .slice(0, 4096)
      )
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  public async list(interaction: ChatInputCommandInteraction) {
    const completed = interaction.options.getBoolean("completed");
    const todos = await this.client.db.todos.findMany({
      where: {
        user_id: BigInt(interaction.user.id)
      }
    });

    if (!todos.length) {
      await interaction.editReply(getLocaleString("todo.strings.list_empty", interaction));
      return;
    }

    if (todos.filter(todo => !todo.completed).length < 1 && !completed) {
      await interaction.editReply(getLocaleString("todo.strings.list_none_active", interaction));
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: getLocaleString(
          completed ? "todo.strings.list_all_title" : "todo.strings.list_active_title",
          interaction,
          { user: interaction.user.username }
        ),
        iconURL: interaction.user.displayAvatarURL()
      })
      .setDescription(
        todos
          .filter(todo => completed || !todo.completed)
          .map(
            todo =>
              getLocaleString("todo.strings.list_item", interaction, {
                id: todo.id,
                todo: todo.todo
              }) +
              (completed
                ? getLocaleString("todo.strings.list_item_completed", interaction, {
                    completed: !todo.completed
                  })
                : "")
          )
          .join("\n\n")
          .slice(0, 4093) + "..."
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
        getLocaleString("todo.strings.complete_others_todo", interaction)
      );
      return;
    }

    if (!exists) {
      await interaction.editReply(getLocaleString("todo.strings.todo_not_found", interaction));
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
        await interaction.editReply(
          getLocaleString("todo.strings.complete_error", interaction, { err })
        );
        return;
      })
      .finally(async () => {
        await interaction.editReply(
          getLocaleString("todo.strings.complete_success", interaction, { id })
        );
        return;
      });
  }
}
