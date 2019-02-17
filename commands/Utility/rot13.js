const { Command } = require('klasa');
const Discord = require('discord.js');

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
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Encode/decode with the ROT13 cipher',
            quotedStringSupport: false,
            usage: '<args:string> [...]',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [...args]) {
    this.customizeResponse('args', "I can't help you if you won't tell me what to cipher, chief.")
    let toCipher = args.join(' ');
    let ciphered = toCipher.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
    const embed = new Discord.MessageEmbed()
    .setAuthor(`ROT13 Cipher`, this.client.user.displayAvatarURL({size: 2048}))
    .setDescription(`**Original text**\n\`${toCipher}\`\n\n**Cipher text**\n\`${ciphered}\``)
    .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL)
    .setTimestamp();
    message.send(embed)
    }

    async init() {

    }

};