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

    this.mainRegex = /(?<!\[)\[\[[\w\s`~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\\\|\;\:\'\"\,\<\.\>\/\?]+\]\](?!\])/g;
    this.secondRegex = /\[\[\s[\w`~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\{\}\\\|\;\:\'\"\,\<\.\>\/\?]+\s\]\]/g;
    this.tweaksearchURL = pkg => `https://code.arx8x.net/debian/?query=${pkg}`; // API by @arx8x on GitHub <3
  }

  formatBytes(a, b) { if (0 == a) return "0 B"; var c = 1024, d = b || 2, e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

  async run(message) {
    const isGuild = Boolean(message.guild);

    if (!message.author.settings.get('tweaksearch') || !(isGuild ? message.guild.settings.get('tweaksearch') : true)) return;

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
        const name = res[0].name;
        const pkg = res[0].package;
        const section = res[0].section;
        const description = res[0].description;
        const depiction = res[0].depiction;
        const homepage = res[0].homepage;
        const version = res[0].version;
        const icon = res[0].icon ? res[0].icon.includes('file:///') ? null : res[0].icon : null;
        const repo = res[0].source.url;
        const size = this.formatBytes(res[0].size);
        const repoURL = `https://cydia.saurik.com/api/share#?source=${repo}`;
        const repoName = res[0].source.name;
        const repoPackageURL = `${repoURL}&package=${pkg}`;
        const downloadURL = `${repo}/${res[0].filename}`;
        const relevancy = parseFloat(res[0].search_score.toFixed(2));

        const embed = new MessageEmbed()
          .setTitle(`${name} (\`${pkg}\`)`)
          .setDescription(`[Open in Cydia](https://cdn.penfoldium.org/cydia?package=${pkg})\n[Add repo (${repoName})](${repoURL})\n[Add repo and go to package](${repoPackageURL})\n[Download .deb](${downloadURL})`)
          .addField('Description', description)
          .addField('Section', section, true)
          .addField('Size', size, true)
          .setURL(depiction || homepage)
          .setFooter(`Version: ${version} | ${relevancy}% match`)
          .setColor(this.client.options.config.embedHex)
          .setTimestamp();
        if (icon) embed.setThumbnail(icon);

        return await message.channel.send(embed);
      });
    })
  }

  async init() {

  }

};