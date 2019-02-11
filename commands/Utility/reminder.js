const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'remindme',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 30,
            deletable: true,
            bucket: 1,
            aliases: ['reminder'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Create a reminder',
            quotedStringSupport: false,
            usage: '<duration:time> <text:string> [...]',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [duration, ...text]) {
        const reminder = await this.client.schedule.create('reminder', duration, {
            data: {
                user: message.author.id,
                channel: message.guild ? message.channel.id : null,
                text: text.join(' ')
            },
            catchUp: true
        });
        return message.send(`Reminder with the ID \`${reminder.id}\` created! I'll DM you when the time comes!${message.guild ? " (I will also send you a reminder message here)" : ''}`)
    }

    async init() {

    }

};