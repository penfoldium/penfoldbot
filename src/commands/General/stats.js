const { Command, version: klasaVersion, Duration } = require('klasa');
const { version: discordVersion, MessageEmbed } = require('discord.js');
const os = require('os');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            guarded: true,
            deletable: true,
            requiredPermissions: ["EMBED_LINKS"],
            description: language => language.get('COMMAND_STATS_DESCRIPTION')
        });
    }

    async run(message) {
        let [activeUsers, users, guilds, channels, memory] = [0, 0, 0, 0];

        if (this.client.shard) {
            const results = await this.client.shard.broadcastEval(`this.users.size, [this.guilds.reduce((acc, cur) => acc + cur.memberCount, 0), this.guilds.size, this.channels.size, (process.memoryUsage().heapUsed / 1024 / 1024)]`);
            for (const result of results) {
                activeUsers += result[0]
                users += result[1];
                guilds += result[2];
                channels += result[3];
                memory += result[4];
            }
        }

        const embed = new MessageEmbed()
            .setColor(this.client.options.config.embedHex)
            .setAuthor('System Information', this.client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .addField("Connected to:", `**${(guilds || this.client.guilds.size).toLocaleString()}** servers | **${(channels || this.client.channels.size).toLocaleString()}** channels | **${(users || this.client.guilds.reduce((acc, cur) => acc + cur.memberCount, 0)).toLocaleString()}** users | **${(activeUsers || this.client.users.size).toLocaleString()}** active users`)
            .addField("OS Information:", `**${os.type()} ${os.release()} ${os.arch()}**\n**System uptime:** ${Duration.toNow(Date.now() - (os.uptime() * 1000))}\n**CPU:** ${os.cpus()[0].model}\n**RAM:** ${this.bToGB(os.freemem)}GB free of ${this.bToGB(os.totalmem)}GB`)
            .addField("Bot Information:", `**Bot uptime:** ${Duration.toNow(Date.now() - this.client.uptime)}\n**RAM usage:** ${(memory || (process.memoryUsage().heapUsed / 1024 / 1024)).toFixed(2)}MB\n**Node.js version:** ${process.version}\n**Discord.js version:** ${discordVersion}\n**Klasa framework version:** ${klasaVersion}`)
            .addField("(Active users are counted for the past 30 minutes)", '⠀')
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
            .setTimestamp();
        return message.send(embed)
    }

    bToGB(bytes) {
        const byte = 0.00000095367432 / 1000;
        return (byte * bytes).toFixed(2);
    }

};
