const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'subgap',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 30,
            deletable: true,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Compares the subscriber counts of two YouTube channels and also shows the subscriber gap between them',
            quotedStringSupport: false,
            usage: '<channel1:string> <channel2:string>',
            usageDelim: ' || ',
            extendedHelp: 'No extended help available.'
        });

        this.customizeResponse('channel1', "Chief, you need to enter two channel names or IDs, separated by two vertical bars! Here\'s an example: `subgap PewDiePie || T-Series`")
        this.customizeResponse('channel2', "You can\'t expect me to compare two channels if you only give me one, chief.")
    }

    async run(message, [channel1, channel2]) {
        const { youtubeAPI } = this.client.options.config;
        const name = (search, key) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=${key}&type=channel`;
        const subs = (id, key) => `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${id}&key=${key}`;

        const identical = "Cor, chief, how are you going to compare a channel to itself?";
        if (channel1.toLowerCase() === channel2.toLowerCase()) throw identical;

        let ch1 = await fetch(name(channel1, youtubeAPI))
        ch1 = await ch1.json();

        if (ch1.pageInfo.totalResults < 1) return message.send(`Oh, crumbs! I couldn't find any channel for \`${channel1}\`!`);

        let ch2 = await fetch(name(channel2, youtubeAPI))
        ch2 = await ch2.json();

        if (ch2.pageInfo.totalResults < 1) return message.send(`Oh, crumbs! I couldn't find any channel for \`${channel2}\`!`);

        if (ch1.items[0].id.channelId === ch2.items[0].id.channelId) throw identical;

        let subs1 = await fetch(subs(ch1.items[0].id.channelId, youtubeAPI));
        subs1 = await subs1.json();

        let subs2 = await fetch(subs(ch2.items[0].id.channelId, youtubeAPI));
        subs2 = await subs2.json();

        const name1 = ch1.items[0].snippet.title,
            name2 = ch2.items[0].snippet.title;

        const subscribers1 = subs1.items[0].statistics.subscriberCount,
            subscribers2 = subs2.items[0].statistics.subscriberCount;

        const text = Number(subscribers1) >= Number(subscribers2)
            ? `${Number(subscribers1 - subscribers2).toLocaleString()} subscribers (in favor of **${name1}**)`
            : `${Number(subscribers2 - subscribers1).toLocaleString()} subscribers (in favor of **${name2}**)`;

        const embed = new MessageEmbed()
            .setAuthor(`YouTube Subscriber Comparison`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .addField(name1, `${Number(subscribers1).toLocaleString()} [🔗](https://www.youtube.com/channel/${ch1.items[0].id.channelId})`, true)
            .addField(name2, `${Number(subscribers2).toLocaleString()} [🔗](https://www.youtube.com/channel/${ch2.items[0].id.channelId})`, true)
            .addField("Subscriber difference", text)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
            .setColor('#2e7da4')
            .setTimestamp();
        return message.send(embed);
    }

    async init() {

    }

};