const { Command, RichDisplay } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'dexonline',
      enabled: true,
      runIn: ['text', 'dm'],
      cooldown: 10,
      deletable: true,
      bucket: 1,
      aliases: ['dex', 'dictionar', 'definitie'],
      guarded: false,
      nsfw: false,
      permissionLevel: 0,
      requiredPermissions: ["EMBED_LINKS"],
      requiredSettings: [],
      subcommands: false,
      description: "Search for a word's definition on dexonline.ro",
      quotedStringSupport: false,
      usage: '<search:...string>',
      usageDelim: ' ',
      extendedHelp: 'No extended help available.'
    });
  }

  async run(message, [search]) {

    let res = await fetch(`https://dexonline.ro/definitie/${encodeURI(search)}/json`);
    res = await res.json();

    const { definitions } = res;
    if (!definitions || !definitions.length) throw "No results found for your search. Check your spelling for any typos."

    const final = [];

    definitions.forEach(def => {
      const thing = this.superScripter(this.dexToMarkdown(def.internalRep));
      const text = thing.length > 1024 ? this.shorten(thing, 1020) + ' […]' : thing;

      final.push({ id: def.id, text, source: def.sourceName })
    })

    const display = new RichDisplay(new MessageEmbed().setTitle('dexonline.ro search').setURL(`https://dexonline.ro/definitie/${encodeURI(search)}`).setColor(this.client.options.config.embedHex));

    final.forEach((def) => {
      const [text, footnotes] = this.processFootnotes(def.text);
      display.addPage(e => {
        e.setDescription(`${text}`);
        if (footnotes.length) e.addField('Footnotes:', footnotes.join('\n'));
        e.addField(`Source: ${def.source}`, `[Go to definition](https://dexonline.ro/definitie/${def.id})`);
        return e;
      })
    })

    return display.run(message, { filter: (reaction, user) => user === message.author });

  }

  async init() {

  }

  dexToMarkdown(input) {
    return input
      .replace(/\*\*/g, "♦")
      .replace(/\*/g, "◊")
      .replace(/@/g, "**")
      .replace(/\$/g, "*")
      .replace(/#|&#039;/g, "")
      .replace(/\n/g, " ");
  }

  processFootnotes(text) {
    const regex = /{{([^}]+)}}/g;
    const footnotes = [];

    const matches = text.matchAll(regex);
    for (const match of matches) footnotes.push(match[1]);

    return [text.replace(regex, ''), footnotes];
  }

  // Inspired by https://stackoverflow.com/a/46810963
  superScripter(str) {
    const superMap = {
      '^0': '⁰', '^1': '¹', '^2': '²', '^3': '³', '^4': '⁴',
      '^5': '⁵', '^6': '⁶', '^7': '⁷', '^8': '⁸', '^9': '⁹'
    }
    return str.replace(/\^[0-9]/g, match => superMap[match]);
  }

  // Source: https://stackoverflow.com/a/40382963
  shorten(str, maxLen, separator = ' ') {
    if (str.length <= maxLen) return str;
    return str.substr(0, str.lastIndexOf(separator, maxLen));
  }

};