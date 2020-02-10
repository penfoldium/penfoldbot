const { Task } = require('klasa');
const fetch = require('node-fetch');

module.exports = class extends Task {

    constructor(...args) {
        super(...args, { name: 'items', enabled: true });
    }

    async run() {
        this.check();
    }

    async init() {
        this.check();
    }

    async check() {
        let res = await fetch('https://fortnite-public-api.theapinetwork.com/store/get');
        if (res.status !== 200) throw "The Fortnite items API is down or unreachable.";
        res = await res.json();
        this.client._itemshop = res.data;
        if (this.client.settings.get('fortniteitems') == res.lastUpdate) return;
        await this.client.settings.update('fortniteitems', res.lastUpdate);
        this.client.users.forEach(async (u) => {
            if (u.bot) return;
            const settings = u.settings.get('fortniteitems');
            if (!settings.length) return;
            const items = res.data.map(i => i.item.name);
            const common = items.filter(name => settings.includes(name.toLowerCase()));
            if (common.length) u.send(`Chief! These items are now available in the item shop. Remember - spend your V-Bucks wisely!\n\`${common.join(', ')}\``);
        });
    }
};