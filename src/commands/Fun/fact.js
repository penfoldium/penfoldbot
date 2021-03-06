const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'fact',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['facts'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: "Get a random fact",
            quotedStringSupport: false,
            usage: '',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message) {
        
        let fact = await fetch(`https://nekos.life/api/v2/fact`);
        fact = await fact.json();

        const embed = new MessageEmbed()
            .setColor(this.client.options.config.embedHex)
            .setDescription(fact.fact)
            .setAuthor(`Random fact`, this.client.user.displayAvatarURL({ size: 1024, format: 'png' }))
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag} | Powered by nekos.life`, message.author.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }));

        return message.send(embed);
    }

    async init() {

    }

};