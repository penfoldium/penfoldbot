const { Command, Timestamp } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'itemshop',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 10,
            deletable: true,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: 'Set reminders that go off when specified items become available in Fortnite\'s item shop. Spend your V-Bucks wisely!',
            quotedStringSupport: false,
            usage: '[list] [shop|daily] [item:...string]',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [list, shop, item]) {

        if (shop) {
            if (!this.client._itemshop) throw "Oh, crumbs! Something went wrong, try again later.";
            /* We multiply this by a thousand because the API returns time in UNIX Timestamp format */
            return message.send(`Here are all the currently available items for ${new Timestamp('LL').display(this.client.settings.get('fortniteitems') * 1000)}:\n\`${this.client._itemshop.map(i => i.item.name).sort().join(', ')}\``);
        }

        if (list) {
            const settings = message.author.settings.get('fortniteitems');
            return message.send(settings.length < 1 ? "You don\'t have any items on your list, chief!" : `Here are the items on your reminder list: \`${settings.join(', ')}\``);
        }

        if (!item) throw 'Tell me the item you\'re interested in and I\'ll make sure to remind you about it when it\'s available!';
        const results = await message.author.settings.update('fortniteitems', item.toLowerCase());
        if (results.errors.length) throw `Oh, crumbs! Something unexpected happened! ${results.errors[0]}`;
        if (results.updated[0].data[1].includes(item.toLowerCase())) return message.send(`Successfully added **${item}** to your item shop reminder list!`);
        else return message.send(`Successfully removed **${item}** from your item shop reminder list!`);
    }

    async init() {

    }

};