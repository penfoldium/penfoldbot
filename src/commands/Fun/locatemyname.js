const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'locatemyname',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['name', 'mapname', 'namemap'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: "See the world distribution map of a given name",
            quotedStringSupport: false,
            usage: '<name:str{3}>',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
        this.customizeResponse('name', `Invalid name. (minimum 3 characters)`)
    }

    async run(message, name) {
        
        const map = `http://www.locatemyname.com/density-map/${name}.jpg`
        let size = await fetch(map);
        size = await size.buffer();
        size = size.length;

        if(!size) throw 'There is no known data for this name, chief!'

        const embed = new MessageEmbed()
            .setColor(this.client.options.config.embedHex)
            .setImage(map)
            .setAuthor(`World distribution of the name ${name}`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 2048 }));

        return message.send(embed);
    }

    async init() {

    }

};