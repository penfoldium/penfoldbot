const { Command } = require('klasa');
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
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Search for a channel on YouTube!',
            quotedStringSupport: false,
            usage: '<channel1:string> <channel2:string>',
            usageDelim: ' || ',
            extendedHelp: 'No extended help available.'
        });

        this.customizeResponse('channel1', "You must provide a search term for the first channel!")
        this.customizeResponse('channel2', "You must provide a search term for the second channel!")
    }

    async run(message, [channel1, channel2]) {
        const config = require('../../data/config.json');
        const name = (search, key) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=${key}&type=channel`;
        const subs = (id, key) => `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${id}&key=${key}`;

        let ch1 = await fetch(name(channel1, config.youtubeAPI))
        ch1 = await ch1.json();

        if (ch1.pageInfo.totalResults < 1) return message.send(`No channel with the name of \`${channel1}\` found!`);

        let ch2 = await fetch(name(channel2, config.youtubeAPI))
        ch2 = await ch2.json();

        if (ch2.pageInfo.totalResults < 1) return message.send(`No channel with the name of \`${channel2}\` found!`);

        let subs1 = await fetch(subs(ch1.items[0].id.channelId, config.youtubeAPI));
        subs1 = await subs1.json();

        let subs2 = await fetch(subs(ch2.items[0].id.channelId, config.youtubeAPI));
        subs2 = await subs2.json();

        const name1 = ch1.items[0].snippet.title,
        name2 = ch2.items[0].snippet.title;

        const subscribers1 = subs1.items[0].statistics.subscriberCount,
        subscribers2 = subs2.items[0].statistics.subscriberCount;

        const text = subscribers1 > subscribers2 
        ? `**${name1}** is ${Number(subscribers1 - subscribers2).toLocaleString()} subscribers ahead of **${name2}**`
        : `**${name2}** is ${Number(subscribers2 - subscribers1).toLocaleString()} subscribers ahead of **${name1}**`;

        const total = ` ( ${name1}: ${Number(subscribers1).toLocaleString()}, ${name2}: ${Number(subscribers2).toLocaleString()} )`

        return message.send(text + total);

    }

    async init() {

    }

};