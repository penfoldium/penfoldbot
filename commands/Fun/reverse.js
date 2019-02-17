const { Command } = require('klasa');
const Discord = require("discord.js");

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
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Reverse text',
            quotedStringSupport: false,
            usage: '<args:...string>',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
        this.customizeResponse('args', "!feihc ,esrever ot tahw wonk t'nod I")
    }

    async run(message, [args]) {
        let reversed = args.split('').reverse().join('');
        const embed = new Discord.MessageEmbed()
        .setAuthor(`Reverse text`, this.client.user.displayAvatarURL({size: 2048}))
        .setDescription(`**Original text**\n\`${args}\`\n\n**Reversed text**\n\`${reversed}\``)
        .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL)
        .setTimestamp();
        message.send(embed)
    }

    async init() {

    }

};