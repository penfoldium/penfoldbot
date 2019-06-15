const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'hug',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Hug it out!',
            quotedStringSupport: false,
            usage: '[user:member]',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [user]) {
        const img = await fetch(`https://nekos.life/api/v2/img/hug`)
            .then(response => response.json())

        if(!user) throw "You need to mention someone to use this command, chief!"
        const description = (user.user === this.client.user) 
        ? `Oh, you're hugging me, ${message.author}... :heart:` // @bot
        : (user === message.member ? `${user}, I see you're lonely, chief... let me give you a hug :heart:` // @self
                                   : `${user}, here's a hug from ${message.author}! :heart:`) // @user


        const embed = new MessageEmbed()
            .setColor(this.client.options.config.embedHex)
            .setDescription(description)
            .setImage(img.url)
            .setAuthor(`Hug!`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag} | Powered by nekos.life`, message.author.displayAvatarURL({ format: 'png', size: 2048 }));

        return message.send(embed);
    }

    async init() {

    }

};