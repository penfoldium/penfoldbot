const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'poke',
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
            description: 'Poke someone!',
            quotedStringSupport: false,
            usage: '[user:member]',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [user]) {
        const img = await fetch(`https://nekos.life/api/v2/img/poke`)
            .then(response => response.json())

        if(!user) throw "You need to mention someone to use this command, chief!"
        const description = (user.user === this.client.user) 
        ? `Ow. Watch it, ${message.author}!` // @bot
        : (user === message.member ? `\\*pokes ${user}\\*` // @self
                                   : `${user}, ${message.author} is poking you!`) // @user

        const embed = new MessageEmbed()
            .setColor(this.client.options.config.embedHex)
            .setDescription(description)
            .setImage(img.url)
            .setAuthor(`Poke!`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag} | Powered by nekos.life`, message.author.displayAvatarURL({ format: 'png', size: 2048 }));

        return message.send(embed);
    }

    async init() {

    }

};