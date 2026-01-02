import {
  EmbedBuilder,
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
      name: "notes",
      description: "Everything notes related"
    });

    this.builder
      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("add")
          .setDescription("Add a note")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("note")
              .setDescription("What you want to note")
              .setRequired(true)
          )
      )

      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("list")
          .setDescription("See a list of your notes")
      )

      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("search")
          .setDescription("See through your notes")
          .addStringOption(
            new SlashCommandStringOption()
              .setName("search")
              .setDescription("Search query")
              .setRequired(true)
          )
      )

      .addSubcommand(
        new SlashCommandSubcommandBuilder()
          .setName("delete")
          .setDescription("Delete a note")
          .addNumberOption(
            new SlashCommandNumberOption()
              .setName("id")
              .setDescription("The ID of the todo to delete")
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
        interaction.editReply(`Something went wrong when creating your note: ${err}`);
      });

    if (!created) return;
    await interaction.editReply(`Successfully created note with the id of \`${created.id}\`.`);
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
      await interaction.editReply("Can't find any notes matching your search query.");
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Notes containing \`${query}\` for ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setDescription(
        filtered
          .map(
            note =>
              `Note ID: **${note.id}**
Note: **${note.note}**`
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
      await interaction.editReply("You currently don't have any notes.");
      return;
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `Notes for ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL()
      })
      .setDescription(
        notes
          .map(
            note =>
              `Note ID: **${note.id}**
Note: **${note.note}**`
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
      await interaction.editReply(
        "You're being a bit naughty, can't mark delete another user's note!"
      );
      return;
    }

    if (!exists) {
      await interaction.editReply(
        "I'm sorry, but there doesn't seem to be any note with that ID in my database."
      );
      return;
    }

    await this.client.db.notes
      .delete({
        where: {
          id: exists.id
        }
      })
      .catch(async err => {
        await interaction.editReply(`Something went wrong while deleting your todo: ${err}`);
        return;
      })
      .finally(async () => {
        await interaction.editReply(`Successfully deleted note \`${id}\`.`);
        return;
      });
  }
}
