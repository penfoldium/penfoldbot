const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'itemshop',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 10,
            deletable: false,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: [],
            requiredSettings: [],
            subcommands: false,
            description: '',
            quotedStringSupport: false,
            usage: '[list] [item:...string]',
            usageDelim: ' ',
            extendedHelp: 'No extended help available.'
        });
    }

    async run(message, [list, item]) {

        if (list) {
            const settings = await message.author.settings.get('fortniteitems');
            message.send(settings.length < 1 ? "You don't have any items added!" : `Here are all the items you currently have in your Fortnite Shop Reminder: \`${settings.join(', ')}\``)
            return;
        }

        if (!item) return message.send('Please name an item you would like added / removed from your itemshop notification!');
        const results = await message.author.settings.update('fortniteitems', item.toLowerCase());
        if (results.errors.length) return message.send(`Error: ${results.errors[0]}`);
        if (results.updated[0].data[1].includes(item.toLowerCase())) return message.send(`Successfully added **${item}** to the Fortnite Shop Reminder!`);
        else return message.send(`Successfully removed **${item}** from the Fortnite Shop Reminder!`);
    }

    async init() {

    }

};