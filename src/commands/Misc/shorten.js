const { Command } = require('klasa');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'shorten',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 120,
            deletable: true,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Shorten an URL using penfold.fun!',
            quotedStringSupport: false,
            usage: '<url:url> [custom:string]',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });

        this.customizeResponse('url', 'Please provide a valid URL to shorten!')
    }

    async run(message, [url, custom]) {
        const { api } = this.client.options.config.pokole;
        let res = await fetch(`${api}/shorten`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.client._pokole}`,
                url,
                custom: custom ? custom : ''
            }
        })
        res = await res.json();
        if (res.error) throw `An error occured: ${res.error}`;
        else message.send(`Successfully shortened your link! You can access it by visiting <${res.URL}>`)
    }

    async init() {
        if (!this.client.options.config.pokole.username || !this.client.options.config.pokole.password || !this.client.options.config.pokole.api) {
            this.client.emit('wtf', `Pokole username / password / API link not provided, disabling the shorten command.`);
            this.disable();
        }
    }

};