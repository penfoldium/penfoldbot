const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['about', 'details', 'hello'],
			guarded: true,
			cooldown: 120,
			description: language => language.get('COMMAND_INFO_DESCRIPTION')
		});
	}

	async run(message) {
		const embed = new MessageEmbed()
            .setAuthor(`About me`, this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
			.setDescription(`
❯ Hello, chief! I am **Penfold**, Danger Mouse's loyal sidekick, and your faithful personal assistant on Discord! Nice to meet you! :hamster: :heart:
❯ I can help you with reminders and various utilities. To get started, send \`penfold, help\` to see what I can do! (I am mentionable as well, so you can use \`@Penfold help\`)
❯ *Prefixes are case insensitive, so you could also yell at me, but I don't like it when you do that* :cry:
❯ (To change the prefix, run \`<currentPrefix> prefix <newPrefix>\`; to reset it, run \`<currentPrefix> prefix reset\`)
❯ If you want to see how my code works, you can access it [here](https://github.com/penfoldium/penfoldbot)!
❯ My creators are \`YoshiFan13#4985\` and \`alex ☿ raplayer#0001\` - if you find any issues or have any ideas for new features, don't hesitate to contact them!
❯ Alternatively, you can submit an issue on the Git linked above.
❯ You can also find us on the Penfoldbot server - just send \`penfold, server\` for an invite!
❯ Cor, I hope we can be good friends! :blush:`)
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
			.setColor(this.client.options.config.embedHex)
			.setImage('https://media.giphy.com/media/xjad5UahGy9b6qX0gd/giphy.gif')
            .setTimestamp();
        return message.send(embed)
	}

};
