const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'say',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 0,
            deletable: false,
            bucket: 1,
            aliases: ['echo'],
            guarded: false,
            nsfw: false,
            permissionLevel: 10,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Makes the bot say what you typed',
            quotedStringSupport: false,
            usage: '<say:...string>',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [say]) {
    this.customizeResponse('args', "What should I say, though?")
        await message.delete();
        return message.send(say);
    }


    async init() {

    }

};