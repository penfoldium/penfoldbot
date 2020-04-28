const { Command } = require('klasa');
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'reverse',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['rev'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Reverse text',
            quotedStringSupport: false,
            usage: '<text:...string>',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
        this.customizeResponse('text', "!feihc ,esrever ot tahw wonk t'nod I")
    }

    async run(message, [text]) {
        let reversed = text.split('').reverse().join('');
        const embed = new MessageEmbed()
            .setAuthor(`Reverse text`, this.client.user.displayAvatarURL({ size: 1024, format: 'png' }))
            .setDescription(`**Original text**\n\`${text}\`\n\n**Reversed text**\n\`${reversed}\``)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))
            .setColor(this.client.options.config.embedHex)
            .setTimestamp();
        return message.send(embed)
    }

    async init() {

    }

};