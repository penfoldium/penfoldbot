const { Command } = require('klasa');
const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'video',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['youtube', 'yt'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Search for a video on YouTube!',
            quotedStringSupport: false,
            usage: '<term:...string>',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });

        this.customizeResponse('term', "You must provide a search term!")
    }

    async run(message, [term]) {
        const { youtubeAPI } = this.client.options.config;

        const url = (search, key) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=${key}&type=video`;
        const stats = (id, key) => `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${key}`;

        let res = await fetch(url(term, youtubeAPI))
        res = await res.json();

        let info = await fetch(stats(res.items[0].id.videoId, youtubeAPI))
        info = await info.json();

        const views = info.items[0].statistics.viewCount;
        const likes = info.items[0].statistics.likeCount;
        const dislikes = info.items[0].statistics.dislikeCount;
        const comments = info.items[0].statistics.commentCount;
        const uploadDate = new Date(info.items[0].snippet.publishedAt);

        return message.send(`https://youtu.be/${res.items[0].id.videoId}\n\`Uploaded on ${uploadDate.toString()}\n${Number(views).toLocaleString()} views | ${Number(likes).toLocaleString()} likes | ${Number(dislikes).toLocaleString()} dislikes | ${Number(comments).toLocaleString()} comments\``);
    }

    async init() {

    }

};