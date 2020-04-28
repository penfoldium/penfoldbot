// Copyright (c) 2017-2019 dirigeants. All rights reserved. MIT license.
const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'wikipedia',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['wiki'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Search for an article on Wikipedia',
            quotedStringSupport: false,
            usage: '<query:str>',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(msg, [query]) {
        const article = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`)
            .then(response => response.json())
        if(!article.content_urls) throw `Oh, crumbs! I couldn't find any article for your search!\n(Keep in mind that article titles are case-sensitive excluding the first word)`;

        const embed = new MessageEmbed()
            .setColor(this.client.options.config.embedHex)
            .setThumbnail((article.thumbnail && article.thumbnail.source) || 'https://i.imgur.com/fnhlGh5.png')
            .setURL(article.content_urls.desktop.page)
            .setTitle(article.title)
            .setDescription(article.extract)
            .setAuthor(`Wikipedia Article`, this.client.user.displayAvatarURL({ size: 1024, format: 'png'}))
            .setTimestamp()
            .setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }));

        return msg.sendEmbed(embed);
    }

};
