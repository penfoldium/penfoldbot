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
        await this.client.user.setActivity(`Danger Mouse | ${this.client.options.prefix}help`, { type: "WATCHING" });
        await this.client.user.setStatus('dnd');

        this.ensureTask('items', '*/5 * * * *');
        this.ensureTask('cleanup', '@hourly');
        this.ensureTask('spotifyToken', '@hourly');
        this.ensureTask('pokoleToken', '@hourly');
    }

    async init() {
        const { DBL } = this.client.options.config;

        if (DBL) {
            const dblPoster = new dbl(DBL, this.client)
            dblPoster.on('error', err => console.err(`Something went wrong while posting stats to top.gg: ${err}`))
            this.client.emit('log', 'Posting stats to DBL...')
        }

        if (!this.client.options.config.embedHex) {
            this.client.emit('wtf', 'Embed color not provided in the configuration file, falling back to a default one.');
            this.client.options.config.embedHex = '2e7da4';
        }
    }

    ensureTask(task, time) {
        const schedules = this.client.settings.get('schedules');
        if (!schedules || !schedules.some(s => s.taskName === task)) {
            this.client.schedule.create(task, time);
        }
    }

};
