// Copyright (c) 2017-2019 dirigeants. All rights reserved. MIT license.
const { Command } = require('klasa');
const fetch = await import('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'price',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['convert', 'currency'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Convert currency units (also supports cryptocurrency)',
            quotedStringSupport: false,
            usage: '[amount:float] <currency1:str{1,6}> <currency2:str{1,6}>',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
        this.customizeResponse('currency1', "Chief, you're missing the first currency or its code is invalid (make sure it\'s 1-3 characters)")
        this.customizeResponse('currency2', "Chief, you're missing the second currency or its code is invalid (make sure it\'s 1-3 characters)")
    }

    async run(msg, [amount = 1, currency1, currency2]) {
        const c1 = currency1.toUpperCase();
        const c2 = currency2.toUpperCase();
        const errorMesssage = "Oh, crumbs, something happened. Make sure that the currencies you\'ve specified are correct and then try again!";
        const body = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${c1}&tsyms=${c2}`)
            .then(response => response.json())
            .catch(() => { throw errorMesssage; });
        if (!body[c2]) return msg.sendMessage(errorMesssage);
        return msg.sendMessage(`${amount} ${c1} is **${(body[c2] * amount).toLocaleString()} ${c2}**, chief!`);
    }

};
