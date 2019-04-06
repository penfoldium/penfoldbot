const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'card',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['pickcard', 'pickacard', 'drawcard', 'drawacard'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Draw a card.',
            quotedStringSupport: false,
            usage: '',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message) {
        let cards = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
        let suits = ["hearts! :hearts:", "diamonds! :diamonds:", "clubs! :clubs:", "spades! :spades:"];
        let randomCard = Math.floor((Math.random() * cards.length));
        let randomSuit = Math.floor((Math.random() * suits.length));
        message.send(`Alright, chief! It's the ${cards[randomCard]} of ${suits[randomSuit]}`);
    }

    async init() {

    }

};