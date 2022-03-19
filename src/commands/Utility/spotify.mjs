const { Command, RichDisplay } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = await import('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'spotify',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 20,
            deletable: true,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Search for a track on Spotify',
            quotedStringSupport: false,
            usage: '<song:...string>',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });

        this.customizeResponse('song', 'Please mention a song you would like to search for!');
    }

    async run(message, [song]) {
        if (!this.client._spotify) throw "Sorry chief, I can't access the Spotify API at the moment, please try again later!";

        let res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURI(song)}&type=track`, {
            headers: {
                'Authorization': `Bearer ${this.client._spotify}`
            }
        });
        res = await res.json();
        const tracks = res.tracks.items;

        if (!tracks.length) throw "Oh, crumbs! I couldn't find any tracks for that search!"

        const final = [];

        tracks.forEach(track => {
            final.push({ artists: track.artists.map(a => a.name), name: track.name, displayName: `${track.artists.map(a => a.name).join(', ')} - ${track.name}`, url: `https://open.spotify.com/track/${track.id}`, image: track.album.images[0].url })

        })

        const display = new RichDisplay(new MessageEmbed().setColor(this.client.options.config.embedHex));

        final.forEach((track, index) => {
            display.addPage(e => e.setAuthor('Spotify Search', 'https://cdn.penfoldium.org/icons/spotify.png').setTitle(`${index + 1}. ${track.displayName}`).setURL(track.url).setThumbnail(track.image).addField('Other results', `${final[index + 1] ? `${index + 2}. ${final[index + 1].displayName + '\n'}` : '-'}${final[index + 2] ? `${index + 3}. ${final[index + 2].displayName + '\n'}` : ''}${final[index + 3] ? `${index + 4}. ${final[index + 3].displayName}` : ''}`))
        })

        return display.run(message, { filter: (reaction, user) => user === message.author });
    }

    async init() {
        if (!this.client.options.config.spotify.clientID || !this.client.options.config.spotify.clientSecret) {
            this.client.emit('wtf', `Spotify Client ID or Client Secret not provided, disabling the Spotify command.`);
            this.disable();
        }
    }

};