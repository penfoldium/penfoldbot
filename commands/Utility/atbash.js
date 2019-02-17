const { Command } = require('klasa');
const Discord = require('discord.js');

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
            usage: '<args:string> [...]',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
        this.customizeResponse('args', "I can't help you if you won't tell me what to cipher, chief.")
    }

    async run(message, [...args]) {
    function atbash(input) {
        return input.replace(/[a-z]/gi,
            c => String.fromCharCode(-c.charCodeAt() + (/[a-z]/.test(c) ? 219 : 155)));
    }

    const embed = new Discord.MessageEmbed()
    .setAuthor(`Atbash Cipher`, this.client.user.displayAvatarURL({size: 2048}))
    .setDescription(`**Original text**\n\`${args.join(' ')}\`\n\n**Cipher text**\n\`${atbash(args.join(' '))}\``)
    .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL)
    .setTimestamp();
    message.send(embed)
    }

    async init() {

    }

};