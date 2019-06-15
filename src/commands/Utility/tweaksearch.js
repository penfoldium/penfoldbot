const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'tweaksearch',
            enabled: true,
            runIn: ['text'],
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
			description: 'Toggle the tweak search monitors for yourself or for the server',
            quotedStringSupport: false,
			usage: '[standard|legacy] [user|server]',
			usageDelim: ' ',
			extendedHelp: 'No extended help available.'
		});
	}

	async run(message, [monitor, target]) {

		if (!monitor && !target) {
			const standardEnabled = `= Standard: Enabled = `;
			const legacyEnabled = `= Legacy: Enabled = `;
			const standardDisabled = `[Standard: Disabled]`;
			const legacyDisabled = `[Legacy: Disabled]`;
	
			const standardUser = (message.author.settings.get('tweaksearch')) ? standardEnabled : standardDisabled ;
			const legacyUser = (message.author.settings.get('tweaksearchlegacy')) ? legacyEnabled : legacyDisabled ;
			const standardServer = (message.guild.settings.get('tweaksearch')) ? standardEnabled : standardDisabled ;
			const legacyServer = (message.guild.settings.get('tweaksearchlegacy')) ? legacyEnabled : legacyDisabled ;

			let current;
			const canUseStandard = (standardUser == standardEnabled && standardServer == standardEnabled);
			const canUseLegacy = (legacyUser == legacyEnabled && legacyServer == legacyEnabled);
			if(canUseStandard && canUseLegacy) current = `= You can currently use [[Standard]] and {{Legacy}} tweak searching on this server. =`;
			else if (canUseStandard && !canUseLegacy) current = `= You can currently use [[Standard]] tweak searching on this server. =`;
			else if (!canUseStandard && canUseLegacy) current = `= You can currently use {{Legacy}} tweak searching on this server. =`;
			else current = `[You currently cannot use tweak searching on this server.]`;

			let codeblock = `\`\`\`asciidoc\nTweak Search Configuration\n--\n\nConfiguration for ${message.author.tag}\n${standardUser}\n${legacyUser}\n\nConfiguration for ${message.guild.name}\n${standardServer}\n${legacyServer}\n\n${current}\n\`\`\``;
			return message.send(codeblock);
		}
		
		if ((!monitor && target) || (monitor && !target)) throw `Not enough arguments or invalid usage syntax. Use \`help tweaksearch\` to see proper usage.`

		if (monitor == 'standard' && target == 'user') {
			(message.author.settings.get('tweaksearch')) ? await message.author.settings.update('tweaksearch', false) : await message.author.settings.update('tweaksearch', true);
			return message.send(`[[Standard]] tweak searching has been ${(message.author.settings.get('tweaksearch')) ? `enabled` : `disabled`} for ${message.author.tag}`)
		}

		if (monitor == 'legacy' && target == 'user') {
			(message.author.settings.get('tweaksearchlegacy')) ? await message.author.settings.update('tweaksearchlegacy', false) : await message.author.settings.update('tweaksearchlegacy', true);
			return message.send(`{{Legacy}} tweak searching has been ${(message.author.settings.get('tweaksearchlegacy')) ? `enabled` : `disabled`} for ${message.author.tag}`)
		}

		if (monitor == 'standard' && target == 'server') {
			if (!await message.hasAtLeastPermissionLevel(6)) throw `You don't have permissions to use this command. (Server ownership or Manage Server)`
			let update = (message.guild.settings.get('tweaksearch')) ? await message.guild.settings.update('tweaksearch', false) : await message.guild.settings.update('tweaksearch', true);
			return message.send(`[[Standard]] tweak searching has been ${(message.guild.settings.get('tweaksearch')) ? `enabled` : `disabled`} for ${message.guild.name}`)
		}

		if (monitor == 'legacy' && target == 'server') {
			if (!await message.hasAtLeastPermissionLevel(6)) throw `You don't have permissions to use this command. (Server ownership or Manage Server)`
			let update = (message.guild.settings.get('tweaksearchlegacy')) ? await message.guild.settings.update('tweaksearchlegacy', false) : await message.guild.settings.update('tweaksearchlegacy', true);
			return message.send(`{{Legacy}} tweak searching has been ${(message.guild.settings.get('tweaksearchlegacy')) ? `enabled` : `disabled`} for ${message.guild.name}`)
		}
	}

	async init() {

	}

};