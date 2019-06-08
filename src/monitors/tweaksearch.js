const { Monitor } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            name: 'tweaksearch',
            enabled: true,
            ignoreBots: true,
            ignoreSelf: true,
            ignoreOthers: false,
            ignoreWebhooks: true,
            ignoreEdits: false,
            ignoreBlacklistedUsers: true,
            ignoreBlacklistedGuilds: true
        });

        this.mainRegex = /\[\[[\w\s`~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\\\|\;\:\'\"\,\<\.\>\/\?]+\]\]/g;
        this.secondRegex = /\[\[\s[\w`~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\\\|\;\:\'\"\,\<\.\>\/\?]+\s\]\]/g;
        this.tweaksearchURL = (pkg) => `https://code.xninja.xyz/debian/?query=${pkg}`; // API by @arx8x on GitHub <3
    }

    formatBytes(a, b) { if (0 == a) return "0 B"; var c = 1024, d = b || 2, e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

    async run(message) {
        const isGuild = message.guild ? true : false;

        if (!message.author.settings.tweaksearch || !(isGuild ? message.guild.settings.tweaksearch : true)) return;

        const matches = message.content.match(this.mainRegex);
        if (!matches) return;
        const potential = [];

        matches.forEach(match => {
            if (this.secondRegex.test(match)) return;
            potential.push(match.replace('[[', '').replace(']]', ''));
        });

        if (!potential.length) return;

        potential.forEach(async (match, index) => {
            setTimeout(async () => {
                let res = await fetch(this.tweaksearchURL(match));
                res = await res.json();
                if (res.length === 0) return;
                const display = res.display;
                const name = res.name;
                const section = res.section;
                const description = res.summary;
                const depiction = res.depiction;
                const homepage = res.homepage;
                const version = res.version;
                const icon = res.icon ? res.icon.includes('file:///') ? null : res.icon : null;
                const repo = res.source;
                const size = this.formatBytes(res.size);
                const repoURL = `https://cydia.saurik.com/api/share#?source=${repo}`;
                const repoPackageURL = `${repoURL}&package=${name}`;
                const downloadURL = `${repo}${res.filename}`;
                const relevancy = res.search_score.toFixed(2);
    
                const embed = new MessageEmbed()
                    .setTitle(`${display} (\`${name}\`)`)
                    .setDescription(`[Open in Cydia](https://cdn.penfoldium.org/cydia?package=${name})\n[Add repo](${repoURL})\n[Add repo and go to package](${repoPackageURL})\n[Download .deb](${downloadURL})`)
                    .addField('Description', description)
                    .addField('Section', section, true)
                    .addField('Size', size, true)
                    .setURL(depiction || homepage)
                    .setFooter(`Version: ${version} | ${relevancy}% match`)
                    .setColor(this.client.options.config.embedHex)
                    .setTimestamp();
                    if(icon) embed.setThumbnail(icon);
    
                let msg = await message.channel.send(embed);
                await msg.react('❌');
                msg.awaitReactions((reaction, user) => (reaction.emoji.name === '❌' && (user.id === message.author.id || isGuild ? message.guild.members.get(user.id).permissions.has('ADMINISTRATOR') : false)) && user !== this.client.user, { time: 20000, max: 1 })
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