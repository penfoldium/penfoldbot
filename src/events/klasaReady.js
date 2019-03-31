const { Event } = require('klasa');
const dbl = require('dblapi.js');

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
        const { DBL } = this.client.options.config;

        if (DBL) {
            new dbl(DBL, this.client)
            console.log('Posting stats to DBL...')
        }

        await this.client.user.setActivity(`Danger Mouse | ${this.client.options.prefix}help`, { type: "WATCHING" });
        await this.client.user.setStatus('dnd');

        const s = this.client.settings.schedules;
        if (s.some(e => e.taskName === 'items')) return;
        this.client.schedule.create("items", "*/5 * * * *");
    }

    async init() {

    }

};