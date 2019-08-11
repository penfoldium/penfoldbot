const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'screenshare',
            enabled: true,
            runIn: ['text'],
            cooldown: 30,
            deletable: true,
            bucket: 1,
            aliases: ['screensharing'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Get a link that lets you share your screen in the current voice channel',
            quotedStringSupport: false,
            usage: '',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message) {
        let guildID = message.guild.id;
        let channelID = message.member.voice.channelID;
        if (!channelID) throw "You need to be in a voice channel to use that command, chief!";
        let channelName = message.guild.channels.get(channelID).name;
        const embed = new MessageEmbed()
        .setAuthor(`Discord Screen Sharing`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
        .setDescription(`Click [here](https://discordapp.com/channels/${guildID}/${channelID}) to enable screen sharing in \`${channelName}\``)
        .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
        .setColor(this.client.options.config.embedHex)
        .setTimestamp();
        return message.send(embed);
    }

    async init() {

    }

};