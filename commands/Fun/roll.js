const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'roll',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Roll just like in osu!Bancho',
            quotedStringSupport: false,
            usage: '[number:int] [args:string]',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [number, args]) {
        let random;
        if (number && !args) random = Math.floor(Math.random() * number + 1);
        else random = Math.floor(Math.random() * 101);
        message.send(`${message.channel.type === 'text' ? message.member.displayName : message.author.username} rolls ${random} point(s)`);
    }

    async init() {

    }

};