const { Command } = require("klasa");
const { inspect } = require("util");
const fetch = require("node-fetch");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "shortStats",
      enabled: true,
      runIn: ["text", "dm"],
      cooldown: 120,
      deletable: true,
      bucket: 1,
      aliases: [],
      guarded: false,
      nsfw: false,
      permissionLevel: 10,
      requiredPermissions: [],
      requiredSettings: [],
      subcommands: false,
      description: "Get the status of an URL / all URLs",
      quotedStringSupport: false,
      usage: "[url:url]",
      usageDelim: " ",
      extendedHelp: "No extended help available."
    });
  }

  async run(message, [url]) {
    const { api } = this.client.options.config.pokole;
    let res = await fetch(`${api}/me/links`, {
      headers: {
        Authorization: `Bearer ${this.client._pokole}`
      }
    });
    res = await res.json();
    if (url) {
      const el = res.data.find(el => el.shortURL === url);
      if (!el) return message.send(`\`\`\`${inspect(res.data)}\`\`\``);
      else return message.send(`\`\`\`${inspect(el)}\`\`\``);
    }
    return message.send(`\`\`\`${inspect(res.data)}\`\`\``);
  }

  async init() {
    if (
      !this.client.options.config.pokole.username ||
      !this.client.options.config.pokole.password ||
      !this.client.options.config.pokole.api
    ) {
      this.client.emit(
        "wtf",
        `Pokole username / password / API link not provided, disabling the shorten command.`
      );
      this.disable();
    }
  }
};
