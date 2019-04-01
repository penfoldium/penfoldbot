const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'rot13',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
            bucket: 1,
            aliases: ['caesar'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Encode/decode with the ROT13 cipher',
            quotedStringSupport: false,
            usage: '<text:...string>',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
        this.customizeResponse('text', "I can't help you if you won't tell me what to cipher, chief.")
    }

    async run(message, [text]) {
        let toCipher = text;
        let ciphered = toCipher.replace(/[a-zA-Z]/g, function (c) { return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26); });
        const embed = new MessageEmbed()
            .setAuthor(`ROT13 Cipher`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setDescription(`**Original text**\n\`${toCipher}\`\n\n**Cipher text**\n\`${ciphered}\``)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
            .setColor('#2e7da4')
            .setTimestamp();
        return message.send(embed)
    }

    async init() {

    }

};