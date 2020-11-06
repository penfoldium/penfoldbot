const { Command, RichDisplay } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'shortStats',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 120,
            deletable: true,
            permissionLevel: 10,
            description: 'Get the status of an URL / all URLs',
            usage: '[url:url]',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [url]) {
        const { api } = this.client.options.config.pokole;
        let res = await fetch(`${api}/me/links`, { headers: { "Authorization": `Bearer ${this.client._pokole}` } }).then(res => res.json());

        const linkdata = res.data.map(g => this.generateEmbedDescription(g));

        const display = new RichDisplay(this.embedTemplate);
        linkdata.forEach(linkInfo => display.addPage(embed => embed.setDescription(linkInfo)));


        if (url && res.data.find(el => el.shortURL === url)) return message.send(this.embedTemplate.setDescription(this.generateEmbedDescription(res.data.find(el => el.shortURL === url))));


        return display.run(message, { filter: (reaction, user) => user === message.author });
    }

    async init() {
        if (!this.client.options.config.pokole.username || !this.client.options.config.pokole.password || !this.client.options.config.pokole.api) {
            this.client.emit('wtf', `Pokole username / password / API link not provided, disabling the shorten command.`);
            this.disable();
        }

        this.embedTemplate = new MessageEmbed().setColor(this.client.options.config.embedHex).setTitle('Pokole Stats')

    }

    generateEmbedDescription(el) {
        const long = el.longURL;
        const short = el.shortURL;
        const clicks = el.clicks;
        return `Long URL: ${long}
Short URL: ${short}
Clicks: ${clicks}`
    }

};