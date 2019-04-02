const { Command, Timestamp } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'appstore',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Search an app in the US App Store.',
            quotedStringSupport: false,
            usage: '<app:...string>',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });

        this.customizeResponse('app', "What app would you like to look up?");
    }

    formatBytes(a, b) { if (0 == a) return "0 B"; var c = 1024, d = b || 2, e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

    async run(message, [app]) {
        let res = await fetch(`https://itunes.apple.com/search?term=${app}&country=us&entity=software&limit=1`);
        res = await res.json();
        if (res.resultCount === 0) return message.send("No results found.");
        const icons = {
            60: res.results[0].artworkUrl60,
            100: res.results[0].artworkUrl100,
            512: res.results[0].artworkUrl512,
            1024: res.results[0].artworkUrl512.replace('512x512bb', '1024x1024bb')
        },
            bundle = res.results[0].bundleId,
            price = res.results[0].formattedPrice,
            version = res.results[0].version,
            size = res.results[0].fileSizeBytes,
            appname = res.results[0].trackName,
            screenshots = res.results[0].screenshotUrls,
            ipadScreenshots = res.results[0].ipadScreenshotUrls,
            url = res.results[0].trackViewUrl,
            release = res.results[0].releaseDate,
            update = new Timestamp('LL').display(res.results[0].currentVersionReleaseDate),
            devby = res.results[0].sellerName,
            devurl = res.results[0].artistViewUrl,
            ios = res.results[0].minimumOsVersion,
            rating = res.results[0].averageUserRating || 0,
            ratingcount = res.results[0].userRatingCount || 0,
            versionrating = res.results[0].averageUserRatingForCurrentVersion || 0,
            versionratingcount = res.results[0].userRatingCountForCurrentVersion || 0,
            age = res.results[0].trackContentRating;


        const embed = new MessageEmbed()
            .setAuthor("App Store Search", 'http://yoshifan.me/cdn/herbot/icons/appstore.png')
            .setTimestamp(`${release}`)
            .setTitle(`${appname} \`(${bundle})\``)
            .setURL(`${url}`)
            .setDescription(`Developed by [${devby}](${devurl})`)
            .setFooter(`Requires iOS ${ios} or later | First released on`)
            .setColor(this.client.options.config.embedHex)
            .setImage(`${screenshots[0]}`)
            .setThumbnail(`${icons[100]}`)
            .addField('Version', `${version}`, true)
            .addField('Last update', `${update}`, true)
            .addField('Price', `${price}`, true)
            .addField('Size', this.formatBytes(`${size}`), true)
            .addField('Rating (current version)', `${versionrating} :star: (${versionratingcount} ${versionratingcount == 1 ? 'rating' : 'ratings'})`, true)
            .addField('Rating (all versions)', `${rating} :star: (${ratingcount} ${ratingcount == 1 ? 'rating' : 'ratings'})`, true)
            .addField(`${res.results[0].genres.length == '1' ? 'Category' : 'Categories'}`, res.results[0].genres.join(", "), true)
            .addField('Age rating', `${age}`, true)
            .addField('Icons', `[60x](${icons[60]}) [100x](${icons[100]}) [512x](${icons[512]}) [1024x](${icons[1024]})`, true);

        if (screenshots.length) {
            let screen = [];

            for (let i = 0; i < screenshots.length; i++) {
                screen.push(`[${i + 1}](${screenshots[i]})`)
            }

            embed.addField('Screenshots', screen.slice(0, 7).join(' '), true);
        };

        if (ipadScreenshots.length) {
            let screen = [];

            for (let i = 0; i < ipadScreenshots.length; i++) {
                screen.push(`[${i + 1}](${ipadScreenshots[i]})`)
            }

            embed.addField('iPad Screenshots', screen.slice(0, 7).join(' '), true);
        };

        return message.send(embed);
    }

    async init() {

    }

};