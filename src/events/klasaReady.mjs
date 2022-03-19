const { Event } = require('klasa');
const { Api: topGG_API } = require('@top-gg/sdk');

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
        const { topGG, embedHex } = this.client.options.config;

        if (topGG) {
            const topGGPoster = new topGG_API(topGG);
            topGGPoster.on('error', err => console.error(`Something went wrong while posting stats to top.gg: ${err}`));

            topGGPoster.postStats({
                serverCount: this.client.guilds.cache.size,
                shardId: this.client.shard ? client.shard.ids[0] : null,
                shardCount: this.client.options.shardCount
            });

            setInterval(() => {
                topGGPoster.postStats({
                    serverCount: this.client.guilds.cache.size,
                    shardId: this.client.shard ? client.shard.ids[0] : null,
                    shardCount: this.client.options.shardCount
                });
            }, 1800000);
        }

        if (!embedHex) {
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
