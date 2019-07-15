const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            guarded: true,
            description: language => language.get('COMMAND_PING_DESCRIPTION')
        });
    }

    async run(message) {
        const msg = await message.send('Just a moment... Ping?');
        return message.send(`Pong, chief! [Roundtrip: ${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms | Heartbeat: ${Math.round(this.client.ws.ping)}ms]`);
    }

};
