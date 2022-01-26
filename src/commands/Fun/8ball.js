const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: '8ball',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['ask', 'question'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: "Ask the Magic 8-Ball for an answer...",
            quotedStringSupport: false,
            usage: '<question:reg/\\w+\\?$/>',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });

        this.customizeResponse('question', `You're supposed to ask it a question, chief! (End with a question mark!)`)
    }

    async run(message) {
        let ball = await fetch(`https://nekos.life/api/v2/8ball`);
        ball = await ball.json();

        const embed = new MessageEmbed()
            .setColor(this.client.options.config.embedHex)
            .setDescription(`The Magic 8-Ball says... ${ball.response}`)
            .setImage(ball.url)
            .setAuthor(`Magic 8-Ball`, this.client.user.displayAvatarURL({ size: 1024, format: 'png' }))
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag} | Powered by nekos.life`, message.author.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }));

        return message.send(embed);
    }

    async init() {

    }

};