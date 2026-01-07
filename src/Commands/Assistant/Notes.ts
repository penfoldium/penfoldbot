import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import {
  PenfoldSlashCommandNumberOption,
  PenfoldSlashCommandStringOption,
  PenfoldSlashCommandSubcommandBuilder
} from "../../Classes/PenfoldSlashCommandBuilders.js";
import { getLocaleString } from "../../Util/Helpers.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "notes.name",
      description: "notes.description"
    });

    this.builder
      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("notes.subcommands.add.name")
          .localizeDescription("notes.subcommands.add.description")
          .addStringOption(
            new PenfoldSlashCommandStringOption()
              .localizeName("notes.subcommands.add.options.note.name")
              .localizeDescription("notes.subcommands.add.options.note.description")
              .setRequired(true)
          )
      )

      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("notes.subcommands.list.name")
          .localizeDescription("notes.subcommands.list.description")
      )

      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("notes.subcommands.search.name")
          .localizeDescription("notes.subcommands.search.description")
          .addStringOption(
            new PenfoldSlashCommandStringOption()
              .localizeName("notes.subcommands.search.options.search.name")
              .localizeDescription("notes.subcommands.search.options.search.description")
              .setRequired(true)
          )
      )

      .addSubcommand(
        new PenfoldSlashCommandSubcommandBuilder()
          .localizeName("notes.subcommands.delete.name")
          .localizeDescription("notes.subcommands.delete.description")
          .addNumberOption(
            new PenfoldSlashCommandNumberOption()
              .localizeName("notes.subcommands.delete.options.id.name")
              .localizeDescription("notes.subcommands.delete.options.id.description")
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
      case "search":
        this.search(interaction);
        break;
      case "list":
        this.list(interaction);
        break;
      case "delete":
        this.delete(interaction);
        break;
    }
  }

  public async add(interaction: ChatInputCommandInteraction) {
    const note = interaction.options.getString("note", true);

    const created = await this.client.db.notes
      .create({
        data: {
          user_id: BigInt(interaction.user.id),
          note
        }
      })
      .catch(err => {
        interaction.editReply(getLocaleString("notes.strings.create_error", interaction, { err }));
      });

    if (!created) return;
    await interaction.editReply(
      getLocaleString("notes.strings.create_success", interaction, { id: created.id })
    );
  }

  public async search(interaction: ChatInputCommandInteraction) {
    const query = interaction.options.getString("search", true);
    const notes = await this.client.db.notes.findMany({
      where: {
        user_id: BigInt(interaction.user.id)
      }
    });

    const filtered = notes.filter(note => note.note.toLowerCase().includes(query));

    if (!filtered.length) {
      await interaction.editReply(getLocaleString("notes.strings.search_not_found", interaction));
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: getLocaleString("notes.strings.search_results_title", interaction, {
          query,
          user: interaction.user.username
        }),
        iconURL: interaction.user.displayAvatarURL()
      })
      .setDescription(
        filtered
          .map(note =>
            getLocaleString("notes.strings.search_result_item", interaction, {
              id: note.id,
              note: note.note
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
    const notes = await this.client.db.notes.findMany({
      where: {
        user_id: BigInt(interaction.user.id)
      }
    });

    if (!notes.length) {
      await interaction.editReply(getLocaleString("notes.strings.list_empty", interaction));
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: getLocaleString("notes.strings.list_title", interaction, {
          user: interaction.user.username
        }),
        iconURL: interaction.user.displayAvatarURL()
      })
      .setDescription(
        notes
          .map(note =>
            getLocaleString("notes.strings.search_result_item", interaction, {
              id: note.id,
              note: note.note
            })
          )
          .join("\n\n")
          .slice(0, 4093) + "..."
      )
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  public async delete(interaction: ChatInputCommandInteraction) {
    const id = interaction.options.getNumber("id", true);
    const exists = await this.client.db.notes.findUnique({
      where: {
        id
      }
    });

    if (exists && exists.user_id !== BigInt(interaction.user.id)) {
      await interaction.editReply(getLocaleString("notes.strings.delete_others_note", interaction));
      return;
    }

    if (!exists) {
      await interaction.editReply(getLocaleString("notes.strings.note_not_found", interaction));
      return;
    }

    await this.client.db.notes
      .delete({
        where: {
          id: exists.id
        }
      })
      .catch(async err => {
        await interaction.editReply(
          getLocaleString("notes.strings.delete_error", interaction, { err })
        );
        return;
      })
      .finally(async () => {
        await interaction.editReply(
          getLocaleString("notes.strings.delete_success", interaction, { id })
        );
        return;
      });
  }
}
