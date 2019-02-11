const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ownerCheck',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 0,
            deletable: false,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 10,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: '',
            quotedStringSupport: false,
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [...params]) {
        message.send("You're an owner :white_check_mark:")
    }

    async init() {

    }

};