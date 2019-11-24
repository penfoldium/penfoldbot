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
    }

};