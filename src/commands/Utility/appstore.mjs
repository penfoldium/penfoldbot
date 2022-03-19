const { Command, Timestamp } = require('klasa');
const { MessageEmbed } = require('discord.js');
const fetch = await import('node-fetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'appstore',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: true,
            bucket: 1,
            aliases: [],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Search for an app in the iOS App Store (defaults to United States)',
            quotedStringSupport: false,
            usage: '<app:...string>',
            usageDelim: undefined,
            extendedHelp: 'The `--country=xx` flag will search in another region, useful if the app is not available in the US or you want to see region-specific information.'
        });

        this.customizeResponse('app', "What app would you like to look up, chief?");
    }

    formatBytes(a, b) { if (0 == a) return "0 B"; var c = 1024, d = b || 2, e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

    async run(message, [app]) {
        let res = await fetch(`https://itunes.apple.com/search?term=${encodeURI(app)}&country=${message.flagArgs.country ? (message.flagArgs.country === 'country' ? 'us' : message.flagArgs.country) : 'us'}&entity=software&limit=1`);
        res = await res.json();
        if (res.resultCount === 0) return message.send("I couldn't find anything, chief.\nIf the app is available only in a specific region, run the command again with the `--country` flag.\n(Example: `penfold, appstore OLX --country=ro`)");
        const icons = {
            60: res.results[0].artworkUrl60,
            100: res.results[0].artworkUrl100,
            512: res.results[0].artworkUrl512,
            1024: res.results[0].artworkUrl512.replace('512x512bb', '1024x1024bb'),
            png: res.results[0].artworkUrl512.replace('512x512bb.jpg', '1024x1024.png')
        },
            // Keycaps (1-10) are in escaped Unicode, because :shortcodes: with links don't play well with Discord on Android and unescaped Unicode is probably not so good practice for coding.
            keycaps = ["\u0031\ufe0f\u20e3", "\u0032\ufe0f\u20e3", "\u0033\ufe0f\u20e3", "\u0034\ufe0f\u20e3", "\u0035\ufe0f\u20e3", "\u0036\ufe0f\u20e3", "\u0037\ufe0f\u20e3", "\u0038\ufe0f\u20e3", "\u0039\ufe0f\u20e3", "\ud83d\udd1f"],
            bundle = res.results[0].bundleId,
            price = res.results[0].formattedPrice,
            version = res.results[0].version,
            size = res.results[0].fileSizeBytes,
            appname = res.results[0].trackName,
            url = res.results[0].trackViewUrl,
            release = res.results[0].releaseDate,
            update = new Timestamp('LL').display(res.results[0].currentVersionReleaseDate),
            devby = res.results[0].artistName,
            devurl = res.results[0].artistViewUrl,
            seller = res.results[0].sellerName,
            sellerurl = res.results[0].sellerUrl,
            ios = res.results[0].minimumOsVersion,
            // iTunes/App Store API no longer offers separate all/current version ratings. Probably changed somewhere between March 20 - April 25 2020.
            // rating = res.results[0].averageUserRating || 0,
            // ratingcount = res.results[0].userRatingCount || 0,
            versionrating = res.results[0].averageUserRatingForCurrentVersion || 0,
            versionratingcount = res.results[0].userRatingCountForCurrentVersion || 0,
            age = res.results[0].trackContentRating;

        let screenshots = res.results[0].screenshotUrls,
            ipadScreenshots = res.results[0].ipadScreenshotUrls;

        const embed = new MessageEmbed()
            .setAuthor("App Store Search", 'https://cdn.penfoldium.org/icons/appstore.png')
            .setTimestamp(`${release}`)
            .setTitle(`${appname} \`(${bundle})\``)
            .setURL(`${url}`)
            .setDescription(`Developed by [${devby}](${devurl})\nSeller/Provider: ${(sellerurl) ? `[${seller}](${sellerurl})` : `${seller}`}`)
            .setFooter(`Requires iOS ${ios} or later | First released on`)
            .setColor(this.client.options.config.embedHex)
            .setImage(`${screenshots[0]}`)
            .setThumbnail(`${icons[512]}`)
            .addField('Version', `${version}`, true)
            .addField('Last update', `${update}`, true)
            .addField('Price', `${price}`, true)
            .addField('Size', this.formatBytes(`${size}`), true)
            .addField('Rating (current version)', `${versionrating.toFixed(1)} :star: (${versionratingcount.toLocaleString()} ${versionratingcount == 1 ? 'rating' : 'ratings'})`, true)
            // .addField('Rating (all versions)', `${rating} :star: (${ratingcount} ${ratingcount == 1 ? 'rating' : 'ratings'})`, true)
            // The API no longer returns "All Versions" ratings despite them actually showing up on older iOS versions (Tested on iPhone 4, iOS 7.1.2)
            .addField(`${res.results[0].genres.length == '1' ? 'Category' : 'Categories'}`, res.results[0].genres.join(", "), true)
            .addField('Age rating', `${age}`, true)
            .addField('Icons', `[60x](${icons[60]}) [100x](${icons[100]}) [512x](${icons[512]}) [1024x](${icons[1024]}) [1024x PNG](${icons['png']})`, true);

        screenshots = screenshots.map(x => x.replace(/.{13}$/g, "3000x0w.png"));
        ipadScreenshots = ipadScreenshots.map(x => x.replace(/.{13}$/g, "3000x0w.png"));

        if (screenshots.length) {
            const screen1 = [], screen2 = [], screen3 = [];
            const screenLink = (i) => `[${keycaps[i]}](${screenshots[i]})`
            for (let i = 0; i < screenshots.length; i++)
                (`${screen1.join(' ')} ${screenLink(i)}`.length <= 1024) ? screen1.push(screenLink(i)) :
                    (`${screen2.join(' ')} ${screenLink(i)}`.length <= 1024) ? screen2.push(screenLink(i)) : screen3.push(screenLink(i))

            embed.addField('iPhone Screenshots', screen1.join(' '), true);
            if (screen2.length) embed.addField('(continued)', screen2.join(' '), true)
            if (screen3.length) embed.addField('(continued)', screen3.join(' '), true)
        };

        if (ipadScreenshots.length) {
            const screen1 = [], screen2 = [], screen3 = [];
            const screenLink = (i) => `[${keycaps[i]}](${ipadScreenshots[i]})`
            for (let i = 0; i < ipadScreenshots.length; i++)
                (`${screen1.join(' ')} ${screenLink(i)}`.length <= 1024) ? screen1.push(screenLink(i)) :
                    (`${screen2.join(' ')} ${screenLink(i)}`.length <= 1024) ? screen2.push(screenLink(i)) : screen3.push(screenLink(i))

            embed.addField('iPad Screenshots', screen1.join(' '), true);
            if (screen2.length) embed.addField('(continued)', screen2.join(' '), true)
            if (screen3.length) embed.addField('(continued)', screen3.join(' '), true)
        };

        return message.send(embed);
    }

    async init() {

    }

};