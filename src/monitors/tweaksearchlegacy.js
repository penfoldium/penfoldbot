const { Monitor } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            name: 'tweaksearchlegacy',
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: false,
            ignoreWebhooks: true,
            ignoreEdits: false,
            ignoreBlacklistedUsers: true,
            ignoreBlacklistedGuilds: true
        });

        this.mainRegex = /\{\{[\w\s`~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\\\|\;\:\'\"\,\<\.\>\/\?]+\}\}/g;
        this.secondRegex = /\{\{\s[\w`~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\\\|\;\:\'\"\,\<\.\>\/\?]+\s\}\}/g;
        this.tweaksearchURL = (pkg) => `https://cydia.saurik.com/api/macciti?query=${pkg}`;
        this.priceAPI = (name) => `http://cydia.saurik.com/api/ibbignerd?query=${name}`;
        this.tweakImageURL = (img) => `http://cydia.saurik.com/icon@2x/${img}.png`;
        this.packageURL = (pkg) => `http://cydia.saurik.com/package/${pkg}`;
    }

    async run(message) {
        const isGuild = message.guild ? true : false;

        if (!message.author.settings.tweaksearchlegacy || !(isGuild ? message.guild.settings.tweaksearchlegacy : true)) return;

        const matches = message.content.match(this.mainRegex);
        if (!matches) return;
        const potential = [];

        matches.forEach(match => {
            if (this.secondRegex.test(match)) return;
            potential.push(match.replace('{{', '').replace('}}', ''));
        });

        if (!potential.length) return;

        potential.forEach(async (match, index) => {
            setTimeout(async () => {
                let res = await fetch(this.tweaksearchURL(match));
                res = await res.json();
                if (res.results < 1) return;
                const display = res.results[0].display;
                const name = res.results[0].name;
                const section = res.results[0].section;
                const description = res.results[0].summary;
                const version = res.results[0].version;
    
                let price = await fetch(this.priceAPI(name));
                price = await price.json();
    
                const embed = new MessageEmbed()
                    .setTitle(`${display} (\`${name}\`)`)
                    .setDescription(`[Open in Cydia](https://cdn.penfoldium.org/cydia?package=${name})`)
                    .addField('Description', description)
                    .addField('Section', section, true)
                    .addField('Price', price ? `$${price.msrp}` : 'Free', true)
                    .setThumbnail(this.tweakImageURL(name))
                    .setURL(this.packageURL(name))
                    .setFooter(`Version: ${version}`)
                    .setColor(this.client.options.config.embedHex)
                    .setTimestamp();
    
                let msg = await message.channel.send(embed);
                await msg.react('❌');
                msg.awaitReactions((reaction, user) => (reaction.emoji.name === '❌' && (user.id === message.author.id || isGuild ? message.guild.members.fetch(user.id).permissions.has('ADMINISTRATOR') : false)) && user !== this.client.user, { time: 20000, max: 1 })
                    .then(async collected => {
                        if (collected.size) return await msg.delete();
                        else await msg.reactions.removeAll();
                    });
            }, index < 1 ? 0 : Number(index + 1) * 1000);
        });
    }

    async init() {

    }

};