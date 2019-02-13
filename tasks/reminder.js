const { Task } = require('klasa');

module.exports = class extends Task {

    constructor(...args) {
        super(...args, { name: 'reminder', enabled: true });
    }

    async run({user, channel, text}) {
        if (channel) {
            try {
                this.client.channels.get(channel).send(`<@${user}> Chief, you wanted me to remind you about this! (I've also DM'd you!)\n:pencil: \`${text}\``)
            } catch (err) { null }
        }
        return this.client.users.get(user).send(`Chief, you wanted me to remind you about this!\n:pencil: \`${text}\``);
    }

    async init() {

    }

};