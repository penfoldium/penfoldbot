const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'quote',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['quotes'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Get a random quote',
            quotedStringSupport: false,
            usage: '',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message) {
        let quote = await fetch(`http://api.forismatic.com/api/1.0/?method=getQuote&format=text&lang=en`);
        quote = await quote.text();

        const embed = new MessageEmbed()
            .setColor(this.client.options.config.embedHex)
            .setDescription(quote)
            .setAuthor(`Random quote`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 2048 }));

        return message.send(embed);
    }

};
