const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'leavevoice',
            enabled: true,
            runIn: ['text'],
            cooldown: 30,
            deletable: true,
            bucket: 1,
            aliases: ['unvoice'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ['MOVE_MEMBERS', 'MANAGE_CHANNELS'],
            requiredSettings: [],
            subcommands: false,
            description: 'Have the bot disconnect you or someone else from a voice channel',
            quotedStringSupport: false,
            usage: '[user:member]',
            usageDelim: '',
            extendedHelp: `By running the command without mentioning someone, you will disconnect yourself from the current voice channel.
\nHowever, if you run the command with a mention, you will disconnect the mentioned user as long as you have the Move Members permission.
(If you mention yourself, Move Members is not required)`
        });
    }

    async run(message, [user = message.member]) {
        if (user !== message.member && !message.member.permissions.has('MOVE_MEMBERS'))
        throw "You can't use this command, chief! You don't have the Move Members permission!";
        let channelID = user.voice.channelID;
        let botName = this.client.user.username.toLowerCase();
        if (!channelID && user === message.member) throw "You aren't connected to any voice channel, chief!";
        if (!channelID && user !== message.member) throw "The mentioned user is not connected to any voice channel.";
        const tempChannel = await message.guild.channels.create(`${botName}-${+new Date}`, { type : 'voice' });
        await user.setVoiceChannel(tempChannel);
        await tempChannel.delete();
        return message.send(`Disconnected ${user.displayName} from voice successfully.`);

    }

    async init() {

    }

};