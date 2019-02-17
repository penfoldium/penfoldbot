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
        const s = this.client.settings.schedules;
        if (s.some(e => e.taskName === 'items')) return;
        this.client.schedule.create("items", "*/5 * * * *");
    }

    async init() {

    }

};