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
            this.client.emit('log', 'Posting stats to DBL...')
        }

        await this.client.user.setActivity(`Danger Mouse | ${this.client.options.prefix}help`, { type: "WATCHING" });
        await this.client.user.setStatus('dnd');

        this.ensureTask('items', '*/5 * * * *');
        this.ensureTask('cleanup', '59 * * * *');
        this.ensureTask('spotifyToken', '59 * * * *');
        this.ensureTask('pokoleToken', '59 * * * *');
    }

    async init() {
        if (!this.client.options.config.embedHex) {
            this.client.emit('wtf', 'Embed color not provided in the configuration file, falling back to a default one.');
            this.client.options.config.embedHex = '2e7da4';
        }
    }

    ensureTask(task, time) {
        const schedules = this.client.settings.schedules;
        if (!schedules.some(s => s.taskName === task)) {
            this.client.schedule.create(task, time);
        }
    }

};
