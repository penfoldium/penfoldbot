const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'server',
            enabled: true,
            runIn: ['text', 'dm'],
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
            description: 'Join the bot\'s official Discord server',
            quotedStringSupport: false,
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message) {
        const { serverInvite } = this.client.options.config;
        message.send(`Here\'s an invite to my official Discord server! https://discord.gg/${serverInvite}`);
    }

    async init() {

    }

};