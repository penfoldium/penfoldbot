const { Command, RichDisplay } = require("klasa");
const { MessageEmbed } = require("discord.js");
const Lyrics = require("@penfoldium/lyrics-search");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "lyrics",
      enabled: true,
      runIn: ["text", "dm"],
      cooldown: 30,
      deletable: true,
      bucket: 1,
      aliases: [],
      guarded: false,
      nsfw: false,
      permissionLevel: 0,
      requiredPermissions: ["EMBED_LINKS"],
      requiredSettings: [],
      subcommands: false,
      description: "Get the lyrics of your favorite songs, from Genius",
      quotedStringSupport: false,
      usage: "<song:...string>",
      usageDelim: " ",
      extendedHelp: "No extended help available."
    });

    this.customizeResponse("song", "What song would you like the lyrics for?");
  }

  async run(message, [song]) {
    const { geniusToken } = this.client.options.config;

    new Lyrics(geniusToken)
      .search(encodeURI(song))
      .then(r => {
        const lyrics = r.lyrics.split("\n\n");
        const display = new RichDisplay(
          new MessageEmbed()
            .setAuthor(
              `Requested by: ${message.author.tag}`,
              this.client.user.displayAvatarURL({ size: 1024, format: "png" })
            )
            .setTitle(`${r.primaryArtist.name} - ${r.title}`)
            .setThumbnail(r.header)
            .setURL(r.url)
            .setColor(this.client.options.config.embedHex)
        );
        lyrics.forEach(lyric => {
          display.addPage(e => e.setDescription(lyric));
        });

        display.run(message, {
          filter: (reaction, user) => user === message.author
        });
      })
      .catch(() =>
        message.send(
          "Oh, crumbs. Something went wrong or I couldn't find any song with this name. Try again later."
        )
      );
  }

  async init() {
    if (!this.client.options.config.geniusToken) {
      this.client.emit(
        "wtf",
        "Genius Access Token not provided in the configuration file, disabling the lyrics command."
      );
      this.disable();
    }
  }
};
