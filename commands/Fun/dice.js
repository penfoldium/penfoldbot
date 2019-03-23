const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'dice',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
            bucket: 1,
            aliases: ['rolldice'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Roll the dice.',
            quotedStringSupport: false,
            usage: '',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message) {
        let sides = ["one", "two", "three", "four", "five", "six"];
        let random1 = Math.floor((Math.random() * sides.length));
        let random2 = Math.floor((Math.random() * sides.length));
        message.send(`Alright, chief! It's ${sides[random1]} and ${sides[random2]}!`);
    }

    async init() {

    }

};