const { Event } = require('klasa');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            name: 'klasaReady',
            enabled: true,
            event: 'klasaReady',
            once: false
        });
    }

    async run() {

        await this.client.user.setActivity(`Danger Mouse | ${this.client.options.prefix}help`, { type: "WATCHING" });
        await this.client.user.setStatus('dnd');

        const s = this.client.settings.schedules;
        if (s.some(e => e.taskName === 'items')) return;
        this.client.schedule.create("items", "*/5 * * * *");
    }

    async init() {

    }

};