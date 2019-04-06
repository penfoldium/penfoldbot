const { Command, RichDisplay } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'lyrics',
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
            description: 'Get the lyrics of your favorite songs, from Genius',
            quotedStringSupport: false,
            usage: '<song:...string>',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });

        this.customizeResponse('song', 'What song would you like the lyrics for?');
    }

    async run(message, [song]) {
        const { geniusToken } = this.client.options.config;
        const msg = await message.send('Loading...');
        const l = require('../../util/lyrics');
        new l(geniusToken).getLyrics(song).then(r => {
            const lyrics = r.lyrics.split('\n\n');
            const display = new RichDisplay(new MessageEmbed().setAuthor(`Requested by: ${message.author.tag}`, this.client.user.displayAvatarURL({ size: 2048 })).setTitle(r.title).setThumbnail(r.header).setURL(r.url).setColor(this.client.options.config.embedHex));
            lyrics.forEach(lyric => {
                display.addPage(e => e.setDescription(lyric))
            });
            display.run(msg, { filter: (reaction, user) => user === message.author });
        }).catch(() => msg.edit('Something went wrong or no song with this name was found. Try again later.'));
    }

    async init() {
        if (!this.client.options.config.geniusToken) {
            this.client.emit('wtf', 'Genius Access Token not provided in the configuration file, disabling the lyrics command.');
            this.disable();
        }
    }

};