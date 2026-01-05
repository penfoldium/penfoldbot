import dayjs from "dayjs";
import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";
import { PenfoldCommand } from "../Classes/PenfoldCommand.js";
import {
  PenfoldSlashCommandStringOption,
  PenfoldSlashCommandSubcommandBuilder
} from "../Classes/PenfoldSlashCommandBuilders.js";
import { bToMB, getLocaleString } from "../Util/Helpers.js";

export default class extends PenfoldCommand {
  constructor(client: PenfoldClient) {
    super(client, {
      name: "utilities.name",
      description: "utilities.description"
    });

    this.builder.addSubcommand(
      new PenfoldSlashCommandSubcommandBuilder()
        .localizeName("utilities.subcommands.appstore.name")
        .localizeDescription("utilities.subcommands.appstore.description")
        .addStringOption(
          new PenfoldSlashCommandStringOption()
            .localizeName("utilities.options.search.name")
            .localizeDescription("utilities.options.search.description")
            .setRequired(true)
        )
        .addStringOption(
          new PenfoldSlashCommandStringOption()
            .localizeName("utilities.options.country_code.name")
            .localizeDescription("utilities.options.country_code.description")
        )
    );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
      case "appstore":
        this.appstore(interaction);
        break;
    }
  }

  public async appstore(interaction: ChatInputCommandInteraction) {
    const search = interaction.options.getString("search", true);
    const country = interaction.options.getString("country_code");
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURI(search)}&country=${country ?? "us"}&entity=software&limit=1`
    ).catch(async err => {
      await interaction.editReply(
        getLocaleString("utilities.strings.appstore.went_wrong", interaction, { err })
      );
      return;
    });
    if (!res) return;
    const data: AppstoreRoot = await res.json().catch(() => {});

    if (data.resultCount === 0 || !data.results || !data.results[0]) {
      await interaction.editReply(
        getLocaleString("utilities.strings.appstore.not_found", interaction)
      );
      return;
    }

    const icons = {
        60: data.results[0].artworkUrl60,
        100: data.results[0].artworkUrl100,
        512: data.results[0].artworkUrl512,
        1024: data.results[0].artworkUrl512.replace("512x512bb", "1024x1024bb"),
        png: data.results[0].artworkUrl512.replace("512x512bb.jpg", "1024x1024.png")
      },
      // Keycaps (1-10) are in escaped Unicode, because :shortcodes: with links don't play well with Discord on Android and unescaped Unicode is probably not so good practice for coding.
      keycaps = [
        "\u0031\ufe0f\u20e3",
        "\u0032\ufe0f\u20e3",
        "\u0033\ufe0f\u20e3",
        "\u0034\ufe0f\u20e3",
        "\u0035\ufe0f\u20e3",
        "\u0036\ufe0f\u20e3",
        "\u0037\ufe0f\u20e3",
        "\u0038\ufe0f\u20e3",
        "\u0039\ufe0f\u20e3",
        "\ud83d\udd1f"
      ],
      bundle = data.results[0].bundleId,
      price = data.results[0].formattedPrice,
      version = data.results[0].version,
      size = data.results[0].fileSizeBytes,
      appname = data.results[0].trackName,
      url = data.results[0].trackViewUrl,
      release = data.results[0].releaseDate,
      update = data.results[0].currentVersionReleaseDate,
      devby = data.results[0].artistName,
      devurl = data.results[0].artistViewUrl,
      seller = data.results[0].sellerName,
      sellerurl = data.results[0].sellerUrl,
      ios = data.results[0].minimumOsVersion,
      versionrating = data.results[0].averageUserRatingForCurrentVersion || 0,
      versionratingcount = data.results[0].userRatingCountForCurrentVersion || 0,
      age = data.results[0].trackContentRating;

    const screenshots = data.results[0].screenshotUrls.map(x =>
        x.replace(/.{13}$/g, "3000x0w.png")
      ),
      ipadScreenshots = data.results[0].ipadScreenshotUrls.map(x =>
        x.replace(/.{13}$/g, "3000x0w.png")
      );

    const embed = new EmbedBuilder()
      .setAuthor({
        name: getLocaleString("utilities.strings.appstore.search", interaction),
        iconURL:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/App_Store_(iOS).svg/960px-App_Store_(iOS).svg.png"
      })
      .setTimestamp(dayjs(release).toDate())
      .setTitle(`${appname} \`(${bundle})\``)
      .setURL(url)
      .setDescription(
        getLocaleString("utilities.strings.appstore.developed_by", interaction, {
          developer: `[${devby}](${devurl})`,
          seller: sellerurl ? `[${seller}](${sellerurl})` : `${seller}`
        })
      )
      .setFooter({
        text: getLocaleString("utilities.strings.appstore.footer", interaction, { ios })
      })
      .setImage(screenshots[0]!)
      .setThumbnail(icons[512])
      .addFields([
        {
          name: getLocaleString("utilities.strings.appstore.version", interaction),
          value: version,
          inline: true
        },
        {
          name: getLocaleString("utilities.strings.appstore.last_updated", interaction),
          value: update,
          inline: true
        },
        {
          name: getLocaleString("utilities.strings.appstore.price", interaction),
          value: price,
          inline: true
        },
        {
          name: getLocaleString("utilities.strings.appstore.size", interaction),
          value: bToMB(Number(size)),
          inline: true
        },
        {
          name: getLocaleString("utilities.strings.appstore.rating_title", interaction),
          value: `${versionrating.toFixed(1)} :star: (${versionratingcount.toLocaleString()} ${getLocaleString(versionratingcount == 1 ? "utilities.strings.appstore.rating" : "utilities.strings.appstore.ratings", interaction)}`,
          inline: true
        },
        {
          name: getLocaleString(
            data.results[0].genres.length == 1
              ? "utilities.strings.appstore.category"
              : "utilities.strings.appstore.categories",
            interaction
          ),
          value: data.results[0].genres.join(", "),
          inline: true
        },
        {
          name: getLocaleString("utilities.strings.appstore.age_rating", interaction),
          value: age,
          inline: true
        },
        {
          name: getLocaleString("utilities.strings.appstore.icons", interaction),
          value: `[60x](${icons[60]}) [100x](${icons[100]}) [512x](${icons[512]}) [1024x PNG](${icons["png"]})`,
          inline: true
        }
      ]);

    if (screenshots.length) {
      const screen1 = [],
        screen2 = [],
        screen3 = [];

      const screenLink = (i: number) => `[${keycaps[i]}](${screenshots[i]})`;

      for (let i = 0; i < screenshots.length; i++)
        if ((screen1.join(" ") + screenLink(i)).length <= 1024) screen1.push(screenLink(i));
        else if ((screen2.join(" ") + screenLink(i)).length <= 1024) screen2.push(screenLink(i));
        else screen3.push(screenLink(i));

      embed.addFields({
        name: getLocaleString("utilities.strings.appstore.iphone_screenshots", interaction),
        value: screen1.join(" "),
        inline: true
      });
      if (screen2.length)
        embed.addFields({
          name: getLocaleString("utilities.strings.appstore.continued", interaction),
          value: screen2.join(" "),
          inline: true
        });
      if (screen3.length)
        embed.addFields({
          name: getLocaleString("utilities.strings.appstore.continued", interaction),
          value: screen3.join(" "),
          inline: true
        });
    }

    if (ipadScreenshots.length) {
      const screen1 = [],
        screen2 = [],
        screen3 = [];

      const screenLink = (i: number) => `[${keycaps[i]}](${ipadScreenshots[i]})`;

      for (let i = 0; i < ipadScreenshots.length; i++)
        if ((screen1.join(" ") + screenLink(i)).length <= 1024) screen1.push(screenLink(i));
        else if ((screen2.join(" ") + screenLink(i)).length <= 1024) screen2.push(screenLink(i));
        else screen3.push(screenLink(i));

      embed.addFields({
        name: getLocaleString("utilities.strings.appstore.ipad_screenshots", interaction),
        value: screen1.join(" "),
        inline: true
      });
      if (screen2.length)
        embed.addFields({
          name: getLocaleString("utilities.strings.appstore.continued", interaction),
          value: screen2.join(" "),
          inline: true
        });
      if (screen3.length)
        embed.addFields({
          name: getLocaleString("utilities.strings.appstore.continued", interaction),
          value: screen3.join(" "),
          inline: true
        });
    }

    return interaction.editReply({ embeds: [embed] });
  }
}

export type AppstoreRoot = {
  resultCount: number;
  results: AppstoreResult[];
};

export interface AppstoreResult {
  isGameCenterEnabled: boolean;
  ipadScreenshotUrls: string[];
  screenshotUrls: string[];
  appletvScreenshotUrls: unknown[];
  artworkUrl512: string;
  supportedDevices: string[];
  features: string[];
  advisories: string[];
  kind: string;
  artistViewUrl: string;
  artworkUrl60: string;
  artworkUrl100: string;
  averageUserRatingForCurrentVersion: number;
  sellerUrl: string;
  languageCodesISO2A: string[];
  fileSizeBytes: string;
  formattedPrice: string;
  userRatingCountForCurrentVersion: number;
  trackContentRating: string;
  artistId: number;
  artistName: string;
  genres: string[];
  price: number;
  bundleId: string;
  releaseDate: string;
  primaryGenreName: string;
  primaryGenreId: number;
  sellerName: string;
  isVppDeviceBasedLicensingEnabled: boolean;
  currentVersionReleaseDate: string;
  releaseNotes: string;
  version: string;
  wrapperType: string;
  currency: string;
  description: string;
  contentAdvisoryRating: string;
  trackCensoredName: string;
  trackViewUrl: string;
  minimumOsVersion: string;
  averageUserRating: number;
  trackId: number;
  trackName: string;
  genreIds: string[];
  userRatingCount: number;
}
