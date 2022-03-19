const { Command } = require('klasa');
const fetch = await import('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'advice',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: ['adviceslip'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Get an advice slip',
            quotedStringSupport: false,
            usage: '',
            usageDelim: '',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message) {
        let advice = await fetch(`https://api.adviceslip.com/advice`);
        advice = await advice.json();

        return message.send(`Here's some advice... ${advice.slip.advice}`);
    }

    async init() {

    }

};
