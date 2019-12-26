const { Command, RichDisplay, Timestamp } = require('klasa');
const { MessageEmbed } = require('discord.js');
const RichMenu = require('../../util/RichMenu');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'panel',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 0,
            deletable: true,
            bucket: 1,
            aliases: ['adminpanel'],
            guarded: false,
            nsfw: false,
            permissionLevel: 10,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: '',
            quotedStringSupport: false,
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });

        this.askText = this.definePrompt('<response:boolean>')
        this.askPresenceText = this.definePrompt('<response:string>');
        this.askGuildID = this.definePrompt('<guild:guild>')

        this.menu = null;
        this.statusMenu = null;
    }

    async run(message) {
        const collector = await this.menu.run(message, { filter: (reaction, user) => user === message.author });
        return this.handleChoices(message, collector);
    }

    async handleChoices(message, collector) {
        const choice = await collector.selection;

        // Servers
        if (choice == 0) {
            const display = new RichDisplay(new MessageEmbed().setColor(this.client.options.config.embedHex));

            const guilds = this.client.guilds.map(async g => {
                const members = await g.members.fetch();
                const bots = members.filter(m => m.user.bot).size;
                const textChannels = g.channels.filter(c => c.type === 'text').size;
                const voiceChannels = g.channels.filter(c => c.type === 'voice').size;
                const categoryChannels = g.channels.size - textChannels - voiceChannels;
                return `Name: ${g.name}
ID: \`${g.id}\`
Owner: ${g.owner}
Channels: ${g.channels.size} (${textChannels} text and ${voiceChannels} voice in ${categoryChannels} categories)
Members: ${g.memberCount} (of which ${bots} bots)
Created: ${new Timestamp('LL').display(g.createdAt)}`
            });

            const guildsResolved = await Promise.all(guilds);
            guildsResolved.forEach(guildInfo => display.addPage(embed => embed.setTitle('Guild Info').setDescription(guildInfo)));
            return display.run(collector.message, { filter: (reaction, user) => user === message.author });
        }

        // Reinitialize status
        else if (choice == 1) {
            this.client.emit('klasaReady');
            await collector.message.delete();
            return message.send(':white_check_mark: Done!');
        }

        // Set status
        else if (choice == 2) {
            const collector2 = await this.statusMenu.run(collector.message, { filter: (reaction, user) => user === message.author });
            const choice2 = await collector2.selection;
            const status = choice2 == 0 ? 'online' : choice2 == 1 ? 'idle' : choice2 == 2 ? 'invisible' : choice2 == 3 ? 'dnd' : 'online';

            if (status === 'invisible') {
                this.client.user.setStatus(status);
                return message.send(':white_check_mark: Done!');
            } else {
                const [response] = await this.askText.createPrompt(message, { target: message.author }).run('Do you want to edit the current presence text?');
                if (response) {
                    const [text] = await this.askPresenceText.createPrompt(message, { target: message.author }).run('Please write the presence text you want to use!');
                    this.client.user.setPresence({ activity: { name: text }, status })
                    return message.send(':white_check_mark: Done!');
                } else {
                    this.client.user.setStatus(status);
                    return message.send(':white_check_mark: Done!');
                }
            }
        }

        // Reboot
        else if (choice == 3) {
            await collector.message.delete();
            await message.send('Just a quick little nap, chief... :hamster::zzz:');
            process.exit();
        }

        // Leave servers
        else if (choice == 4) {
            const [guild] = await this.askGuildID.createPrompt(message).run('What server would you like me to leave?');
            if (guild) {
                await this.client.guilds.get(guild.id).leave();
                return message.send(`:white_check_mark: Left \`${guild.name}\` successfully.`)
            }
        }
    }

    async init() {
        this.menu = new RichMenu(new MessageEmbed().setColor(this.client.options.config.embedHex));

        this.menu.addOption("Servers", "Show a list of the servers the bot is in");
        this.menu.addOption("Reinitialize status", "Run the 'klasaReady' event if the bot loses its presence/status");
        this.menu.addOption("Set status", "Set a custom presence/status");
        this.menu.addOption("Reboot", "Have you tried turning it off and on again?");
        this.menu.addOption("Leave servers", "Specify servers to leave by ID");

        /* -------------------------------------------------------------------- */

        this.statusMenu = new RichMenu(new MessageEmbed().setColor(this.client.options.config.embedHex));

        this.statusMenu.addOption("Online", "Set the status to online");
        this.statusMenu.addOption("Idle", "Set the status to idle");
        this.statusMenu.addOption("Invisible", "Set the status to invisible");
        this.statusMenu.addOption("DND", "Set the status to DND");
    }

};