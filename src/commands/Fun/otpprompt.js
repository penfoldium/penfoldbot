const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const prompts = require('../../util/prompts.json');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'otpprompt',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['otp', 'prompt'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Get a prompt about your favorite OTP',
            quotedStringSupport: false,
            usage: '<personA:string> <personB:string>',
            usageDelim: ' ',
            extendedHelp: 'To add a space to a name (example: "Danger Mouse") you can use underscores instead ("Danger_Mouse") and they will be replaced with spaces in the prompt.'
        });
        this.customizeResponse('personB', "You need to enter two names in order for me to give you a prompt of your OTP!\n(Hint: If you want to use a space for a name, use an underscore instead and I'll replace it with a space in the prompt.)");
        this.customizeResponse('personA', "You need to enter two names in order for me to give you a prompt of your OTP!\n(Hint: If a person has a space in their name, use an underscore instead and I'll replace it with a space in the prompt.)");
    }

    async run(message, [personA, personB]) {

        personA = personA.replace(/_/g, " ").replace(/\n/g,""); // The first replace is for underscores to spaces.
        personB = personB.replace(/_/g, " ").replace(/\n/g,""); // The second replace removes newlines. (Prevents abuse)
        if (!personA.replace(/\s/g, '').length) personA = "Person A"; // This line and the next one make a fallback for
        if (!personB.replace(/\s/g, '').length) personB = "Person B"; // when one enters one or more underscores as a name.

        const embed = new MessageEmbed()
            .setColor(this.client.options.config.embedHex)
            .setDescription(prompts.random().replace(/{A}/g, personA).replace(/{B}/g, personB))
            .setAuthor(`Random OTP prompt for ${personA} and ${personB}`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag} | Sourced from prompts.neocities.org`, message.author.displayAvatarURL({ format: 'png', size: 2048 }));

        return message.send(embed);
    }

    async init() {

    }

};
