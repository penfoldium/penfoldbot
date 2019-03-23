const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'coin',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
            bucket: 1,
            aliases: ['coinflip', 'flipacoin', 'flipcoin'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Flip a coin.',
            quotedStringSupport: false,
            usage: '',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message) {
        let flip = Math.floor(Math.random() * 101);
        let outcome;
        if (flip <= 48) outcome = "It's heads.";
        if (flip <= 96 && flip > 48) outcome = "It's tails.";
        if (flip === 97) outcome = "Cor, it landed on its edge!";
        if (flip === 98) outcome = "Oh, crumbs! It rolled under the bed...";
        if (flip === 99) outcome = "It fell in a crack!";
        if (flip === 100) outcome = "It fell in a crack! And it was half a quid, too!";
        message.send(`Alright, chief! ${outcome}`);
    }

    async init() {

    }

};