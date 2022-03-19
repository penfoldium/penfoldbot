const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = await import('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'bored',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['imbored', 'iambored'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Are you feeling bored? Let the bot give you a random activity, with additional info included',
            quotedStringSupport: false,
            usage: '',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message) {
        let activityDetails = await fetch(`http://www.boredapi.com/api/activity/`);
        activityDetails = await activityDetails.json();

        const activity = activityDetails.activity.charAt(0).toLowerCase() + activityDetails.activity.slice(1);
        const accessibility = Math.floor(100 - activityDetails.accessibility * 100);
        const type = activityDetails.type === 'diy' ? 'DIY' : activityDetails.type.charAt(0).toUpperCase() + activityDetails.type.slice(1);
        const participants = activityDetails.participants;
        const price = activityDetails.price * 100;

        const embed = new MessageEmbed()
            .setColor(this.client.options.config.embedHex)
            .setDescription(`${message.author}, you should ${activity}.`)
            .addField('Accessibility', `${accessibility}%`, true)
            .addField('Price', `${price}%`, true)
            .addField('Participants', participants, true)
            .setAuthor(`Random Activity (${type})`, this.client.user.displayAvatarURL({ size: 1024, format: 'png' }))
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }));

        return message.send(embed);
    }

    async init() {

    }

};
