const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'atbash',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Encode/decode with the Atbash cipher',
            quotedStringSupport: false,
            usage: '<text:...string>',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
        this.customizeResponse('text', "I can't help you if you won't tell me what to cipher, chief.")
    }

    async run(message, [text]) {
        const embed = new MessageEmbed()
            .setAuthor(`Atbash Cipher`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setDescription(`**Original text**\n\`${text}\`\n\n**Cipher text**\n\`${this.atbash(text)}\``)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
            .setColor('#2e7da4')
            .setTimestamp();
        return message.send(embed)
    }

    atbash(input) {
        return input.replace(/[a-z]/gi,
            c => String.fromCharCode(-c.charCodeAt() + (/[a-z]/.test(c) ? 219 : 155)));
    }

    async init() {

    }

};