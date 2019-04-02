const { Command } = require('klasa');
const { MessageEmbed } = require("discord.js");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'reverse',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
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
            .setAuthor(`Reverse text`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setDescription(`**Original text**\n\`${text}\`\n\n**Reversed text**\n\`${reversed}\``)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
            .setColor(this.client.options.config.embedHex)
            .setTimestamp();
        return message.send(embed)
    }

    async init() {

    }

};