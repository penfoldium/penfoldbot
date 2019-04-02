const { Command } = require('klasa');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'channel',
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
            description: 'Searches for a YouTube channel',
            quotedStringSupport: false,
            usage: '<channel:...string>',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });

        this.customizeResponse('channel', "You need to enter a search term, chief!")
    }

    async run(message, [channel]) {
        const { youtubeAPI } = this.client.options.config;
        const name = (search, key) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=${key}&type=channel`;
        const stats = (id, key) => `https://www.googleapis.com/youtube/v3/channels?part=statistics,brandingSettings&id=${id}&key=${key}`;

        let toSearch = channel;
        let ch = await fetch(name(toSearch, youtubeAPI));
        ch = await ch.json();

        if (ch.pageInfo.totalResults < 1) return message.send(`Oh, crumbs! I couldn't find any channel for \`${channel1}\`!`);

        let stats1 = await fetch(stats(ch.items[0].id.channelId, youtubeAPI));
        stats1 = await stats1.json();

        let art = await fetch(stats(ch.items[0].id.channelId, youtubeAPI));
        art = await art.json();

        const channelname = ch.items[0].snippet.title;
        const subscribers = stats1.items[0].statistics.subscriberCount;
        const views = stats1.items[0].statistics.viewCount;
        const videos = stats1.items[0].statistics.videoCount;
        const banner = art.items[0].brandingSettings.image.bannerMobileHdImageUrl;
        const profpic = ch.items[0].snippet.thumbnails.medium.url;
        const description = ch.items[0].snippet.description;
        const fullbanner = banner.replace("w1280-fcrop64=1,32b75a57cd48a5a8", "w2560-fcrop64=1,00000000ffffffff");
        const creation = ch.items[0].snippet.publishedAt;


        const embed = new MessageEmbed()
            .setTitle(channelname)
            .setURL(`https://youtube.com/channel/${ch.items[0].id.channelId}`)
            .setAuthor(`YouTube Channel`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .addField("Subscribers", Number(subscribers).toLocaleString(), true)
            .addField("Videos", Number(videos).toLocaleString(), true)
            .addField("Total views", Number(views).toLocaleString(), true)
            .addField("Description", description, false)
            .addField("Full size banner", `[Click here](${fullbanner})`, false)
            .setImage(banner)
            .setThumbnail(profpic)
            .setFooter(`Requested by ${message.author.tag} | Join date:`, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
            .setColor(this.client.options.config.embedHex)
            .setTimestamp(creation);
        return message.send(embed);
    }

    async init() {

    }

};