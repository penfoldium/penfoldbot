const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'video',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
            bucket: 1,
            aliases: ['youtube', 'yt'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Search for a video on YouTube',
            quotedStringSupport: false,
            usage: '<term:...string>',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });

        this.customizeResponse('term', "Chief, you must provide a search term!")
    }

    async run(message, [term]) {
        const { youtubeAPI } = this.client.options.config;

        const url = (search, key) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=${key}&type=video`;
        const stats = (id, key) => `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${key}`;

        let res = await fetch(url(term, youtubeAPI))
        res = await res.json();

        if (!res.items[0]) throw "Oh, crumbs! I couldn\'t find any videos for that search!"
        let info = await fetch(stats(res.items[0].id.videoId, youtubeAPI))
        info = await info.json();

        const views = info.items[0].statistics.viewCount;
        const likes = info.items[0].statistics.likeCount;
        const dislikes = info.items[0].statistics.dislikeCount;
        const comments = info.items[0].statistics.commentCount;
        const uploadDate = new Date(info.items[0].snippet.publishedAt);

        await message.channel.send(`https://youtu.be/${res.items[0].id.videoId}`)
        const embed = new MessageEmbed()
            .setAuthor(`Additional info`)
            .addField('Views', Number(views).toLocaleString(), true)
            .setFooter(`Requested by ${message.author.tag} | Uploaded on`, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
            .setColor(this.client.options.config.embedHex)
            .setTimestamp(uploadDate);

            if(!isNaN(Number(likes))) embed.addField('Likes', Number(likes).toLocaleString(), true);
            if(!isNaN(Number(dislikes))) embed.addField('Dislikes', Number(dislikes).toLocaleString(), true);
            if(!isNaN(Number(comments))) embed.addField('Comments', Number(comments).toLocaleString(), true);
            if(!isNaN(Number(likes))) embed.addField('Like ratio', (Number(likes) / (Number(likes) + Number(dislikes)) * 100).toFixed(2) + '%', true);
            

        message.send(embed);
    }

    async init() {
        if (!this.client.options.config.youtubeAPI) {
            this.client.emit('wtf', 'YouTube API key not provided in the configuration file, disabling the video command.');
            this.disable();
        }
    }

};