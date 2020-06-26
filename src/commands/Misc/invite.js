const { Command } = require("klasa");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "invite",
      enabled: true,
      runIn: ["text", "dm"],
      cooldown: 120,
      deletable: true,
      bucket: 1,
      aliases: [],
      guarded: false,
      nsfw: false,
      permissionLevel: 0,
      requiredPermissions: [],
      requiredSettings: [],
      subcommands: false,
      description: "Generate an invite link for the bot",
      quotedStringSupport: false,
      usage: "",
      usageDelim: undefined,
      extendedHelp: "No extended help available."
    });
  }

  async run(message) {
    const invite = await this.client.generateInvite("ADMINISTRATOR");
    message.send(`You can invite me using the following link: <${invite}>`);
  }

  async init() {}
};
