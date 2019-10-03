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
            requiredPermissions: ["EMBED_LINKS"],
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

        let res = await fetch(url(encodeURI(term), youtubeAPI))
        res = await res.json();

        if (!res.items[0]) throw "Oh, crumbs! I couldn\'t find any videos for that search!"
        let info = await fetch(stats(res.items[0].id.videoId, youtubeAPI))
        info = await info.json();

        await message.channel.send(`https://youtu.be/${res.items[0].id.videoId}`)

        if (!('noinfo' in message.flagArgs)) {const views = Number(info.items[0].statistics.viewCount);
        const likes = Number(info.items[0].statistics.likeCount);
        const dislikes = Number(info.items[0].statistics.dislikeCount);
        const comments = Number(info.items[0].statistics.commentCount);
        const uploadDate = new Date(info.items[0].snippet.publishedAt);
        const likeRatio = (likes * 100) / (likes + dislikes);

        
        const embed = new MessageEmbed()
            .setAuthor(`Additional info`)
            .setDescription(`(Tip: You can add \`--noinfo\` at the end of your message to omit this section)`)
            .addField('Views', views.toLocaleString(), true)
            .setFooter(`Requested by ${message.author.tag} | Uploaded on`, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
            .setColor(this.client.options.config.embedHex)
            .setTimestamp(uploadDate);

            (!isNaN(likes)) ? embed.addField('Likes', likes.toLocaleString(), true) : embed.addField('Ratings', 'Disabled', true);
            (!isNaN(dislikes)) ? embed.addField('Dislikes', dislikes.toLocaleString(), true) : null;
            (!isNaN(comments)) ? embed.addField('Comments', comments.toLocaleString(), true) : embed.addField('Comments', 'Disabled', true);
            (!isNaN(likes)) ? embed.addField('Like ratio', `${(dislikes) ? likeRatio.toFixed(2) + '%' : 'Infinity'}`, true) : null;
            

        message.channel.send(embed);
        }
    }

    async init() {
        if (!this.client.options.config.youtubeAPI) {
            this.client.emit('wtf', 'YouTube API key not provided in the configuration file, disabling the video command.');
            this.disable();
        }
    }

};