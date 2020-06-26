const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "yesorno",
      enabled: true,
      runIn: ["text", "dm"],
      cooldown: 5,
      deletable: true,
      bucket: 1,
      aliases: ["yesno", "yn"],
      guarded: false,
      nsfw: false,
      permissionLevel: 0,
      requiredPermissions: ["EMBED_LINKS"],
      requiredSettings: [],
      subcommands: false,
      description: "Yes or no? Let the bot decide",
      quotedStringSupport: false,
      usage: "",
      usageDelim: "",
      extendedHelp: "No extended help available."
    });
  }

  async run(message) {
    let yn = await fetch(`https://yesno.wtf/api`);
    yn = await yn.json();

    const embed = new MessageEmbed()
      .setColor(this.client.options.config.embedHex)
      .setTitle(`My answer is ${yn.answer}.`)
      .setImage(yn.image)
      .setAuthor(
        `Yes or no?`,
        this.client.user.displayAvatarURL({ size: 1024, format: "png" })
      )
      .setTimestamp()
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({
          size: 1024,
          format: "png",
          dynamic: true
        })
      );

    return message.send(embed);
  }
};
