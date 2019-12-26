const { Command, RichMenu } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'panel',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 0,
            deletable: true,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 10,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            // TODO: Add a description
            description: '',
            quotedStringSupport: false,
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });

        this.menu = null;
    }

    async run(message) {
        const collector = await this.menu.run(message);
    }

    async init() {
        this.menu = new RichMenu(new MessageEmbed().setColor(this.client.options.config.embedHex));
        // TODO: Add the options wanted (using the this.menu.addOption function)
        this.menu.addOption("Servers", "Show a list of the servers the bot is in");
        this.menu.addOption("Reinitialize status", "Run the 'klasaReady' event if the bot loses its presence/status");
        this.menu.addOption("Set status", "Set a custom presence/status");
        this.menu.addOption("Reboot", "Have you tried turning it off and on again?");
        this.menu.addOption("Leave servers", "Specify servers to leave by ID");
    }

};