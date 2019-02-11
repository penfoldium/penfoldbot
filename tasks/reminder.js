const { Task } = require('klasa');

module.exports = class extends Task {

    constructor(...args) {
        super(...args, { name: 'reminder', enabled: true });
    }

    async run({user, channel, text}) {
        if (channel) {
            try {
                this.client.channels.get(channel).send(`<@${user}> you asked me to remind you something: \`${text}\` (I've also DM'd you!)`)
            } catch (err) { null }
        }
        return this.client.users.get(user).send(`You asked me to remind you something: \`${text}\``);
    }

    async init() {

    }

};