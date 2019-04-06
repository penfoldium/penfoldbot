const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'invite',
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
            description: 'Want to invite the bot to your server? Use this command to generate an invite link!',
            quotedStringSupport: false,
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message) {
        const invite = await this.client.generateInvite('ADMINISTRATOR');
        message.send(`You can invite me using the following link: <${invite}>`);
    }

    async init() {

    }

};