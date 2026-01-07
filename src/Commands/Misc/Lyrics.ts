import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { PenfoldClient } from "../../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../../Classes/PenfoldCommand.js";
import { PenfoldSlashCommandStringOption } from "../../Classes/PenfoldSlashCommandBuilders.js";
import { getLocaleString } from "../../Util/Helpers.js";

export default class extends PenfoldCommand {
  lrclib = "https://lrclib.net/api";

  constructor(client: PenfoldClient) {
    super(client, {
      name: "lyrics.name",
      description: "lyrics.description",
      cooldown: 30
    });

    this.builder
      .addStringOption(
        new PenfoldSlashCommandStringOption()
          .localizeName("lyrics.options.query.name")
          .localizeDescription("lyrics.options.query.description")

          .setRequired(true)
      )

      .addStringOption(
        new PenfoldSlashCommandStringOption()
          .localizeName("lyrics.options.artist.name")
          .localizeDescription("lyrics.options.artist.description")
          .setRequired(false)
      );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const query = interaction.options.getString("query", true);
    const artist = interaction.options.getString("artist");

    const search = artist ? `?track_name=${query}&artist=${artist}` : `?q=${query}`;
    const fetchedRes: Response | false = await fetch(`${this.lrclib}/search${search}`, {
      headers: {
        "User-Agent": `Penfoldbot (https://github.com/penfoldium/penfoldbot)`
      }
    }).catch((err: string) => {
      interaction.reply(getLocaleString("lyrics.strings.went_wrong", interaction, { err }));
      return false;
    });

    if (fetchedRes == false) return;

    const lyrics: LRCLibReturn[] = await fetchedRes.json();

    if (lyrics.length < 1) {
      await interaction.editReply(
        getLocaleString("lyrics.strings.no_lyrics", interaction, { query })
      );

      return;
    }

    const song = lyrics[0]!;
    const embed = new EmbedBuilder()
      .setAuthor({ name: getLocaleString("lyrics.embed.name", interaction) })
      .setTitle(
        getLocaleString("lyrics.embed.title", interaction, {
          artistName: song.artistName,
          trackName: song.trackName
        })
      )
      .setDescription(
        song.plainLyrics.length <= 4096
          ? song.plainLyrics
          : song.plainLyrics.substring(0, 4093) + "..."
      )
      .setColor("#4338ca")
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
