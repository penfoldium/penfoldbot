const { Task } = require('klasa');
const fetch = require('node-fetch');

module.exports = class extends Task {

    constructor(...args) {
        super(...args, { name: 'pokoleToken', enabled: true });
    }

    async run() {
        this.getToken();
    }

    async init() {
        if (!this.client.options.config.pokole.username || !this.client.options.config.pokole.password || !this.client.options.config.pokole.api) {
            this.client.emit('wtf', `Pokole username / password / API link not provided, disabling the ${this.name} task.`);
            this.disable();
            return;
        }

        this.getToken();
    }

    async getToken() {
        let res = await fetch(`${this.client.options.config.pokole.api}/login`, {
            method: "POST",
            headers: {
                'User': this.client.options.config.pokole.username,
                'Password': this.client.options.config.pokole.password
            }
        });
        res = await res.json();
        this.client._pokole = res.token;  
    }

};