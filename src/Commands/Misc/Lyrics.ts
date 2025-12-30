import {
  EmbedBuilder,
  SlashCommandStringOption,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import { getEmbedFooter } from "../../Util/Helpers.js";

export default class extends PenfoldCommand {
  lrclib = "https://lrclib.net/api";

  constructor(client: PenfoldClient) {
    super(client, {
      name: "lyrics",
      description: "Search for song lyrics using LRCLib",
      cooldown: 30,
    });

    this.builder
      .addStringOption(
        new SlashCommandStringOption()
          .setName("query")
          .setDescription("The song you want to the for")
          .setRequired(true)
      )
      .addStringOption(
        new SlashCommandStringOption()
          .setName("artist")
          .setDescription("The artist(s) of the song")
          .setRequired(false)
      );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const query = interaction.options.getString("query", true);
    let artist = interaction.options.getString("artist");

    const search = artist
      ? `?track_name=${query}&artist=${artist}`
      : `?q=${query}`;
    let fetchedRes: Response | false = await fetch(
      `${this.lrclib}/search${search}`,
      {
        headers: {
          "User-Agent": `Penfoldbot (https://github.com/penfoldium/penfoldbot)`,
        },
      }
    ).catch((err: string) => {
      interaction.reply(
        `Something went wrong while fetching the lyrics: ${err}`
      );
      return false;
    });

    if (fetchedRes == false) return;

    const lyrics: LRCLibReturn[] = await fetchedRes.json();

    if (lyrics.length < 1) {
      await interaction.editReply(
        `I'm sorry but no lyrics were found for \`${query}\``
      );

      return;
    }

    const song = lyrics[0]!;
    const embed = new EmbedBuilder()
      .setAuthor({ name: "LRCLib Lyrics Search" })
      .setTitle(`**${song.trackName}** by **${song.artistName}**`)
      .setDescription(
        song.plainLyrics.length <= 4096
          ? song.plainLyrics
          : song.plainLyrics.substring(0, 4093) + "..."
      )
      .setColor("#4338ca")
      .setFooter(getEmbedFooter(interaction))
      .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
  }
}

interface LRCLibReturn {
  id: number;
  name: string;
  trackName: string;
  artistName: string;
  duration: number;
  instrumental: boolean;
  plainLyrics: string;
  syncedLyrics: string | null;
}
