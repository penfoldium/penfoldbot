const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { languages } = require('@vitalets/google-translate-api');
const translate = require('@vitalets/google-translate-api');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'translate',
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 30,
            deletable: true,
            bucket: 1,
            aliases: ['googletranslate', 'transl'],
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            requiredPermissions: ["EMBED_LINKS"],
            requiredSettings: [],
            subcommands: false,
            description: 'Translate text in a desired language',
            quotedStringSupport: true,
            usage: '<input:str> <output:str> <text:...str>',
            usageDelim: ' ',
            extendedHelp: `You can use 'auto' as an input language for your own convenience.
See the supported languages here: penfold.fun/langs
For languages with spaces in them you can either use the language code or enter the name in quotes. 
Example: entering Chinese (Simplified) will not work, but entering "Chinese (Simplified)" or entering zh-CN will work.
You can also use the --alt flag in your command to switch to the alternate translation client (translations may be less accurate than the default client)`
        });

        this.usageText = "Usage: \`translate <input> <output> <text>\`";
        this.customizeResponse('input', `How am I going to translate if you haven't told me anything yet, chief?\n${this.usageText}`)
        this.customizeResponse('output', `Your command syntax is incorrect.\n${this.usageText}`)
        this.customizeResponse('text', `Well, thanks for the languages, I guess, but I still need the text.\n${this.usageText}`)
    }

    async run(message, [input, output, text]) {

        // Switch to the "t" client when the --alt flag is present 
        const client = 'alt' in message.flagArgs ? 't' : 'gtx';

        // Check if the provided languages are supported
        const errorString = "language is not supported or your syntax is incorrect.\nUsage: \`translate <input> <output> <text>\`"
        if (!languages.isSupported(input)) throw `The "${input}" ${errorString}`;
        if (!languages.isSupported(output)) throw `The "${output}" ${errorString}`;

        // The translation itself
        const translated = await translate(text, { from: input, to: output, client }).catch(err => { throw `An error occured during translation: ${err}` });

        // Variables
        const translatedText = translated.text;
        const recognized = languages[translated.from.language.iso];
        const inputLanguage = languages.getCode(input) === 'auto' ? recognized : languages[languages.getCode(input)];
        const pronunciation = translated.pronunciation;

        // Check if Google was able to translate the given text or not
        if (translatedText === text) return message.send(`Sorry, Google couldn't translate your text. Please try again, it might be in ${recognized}.`)

        // Send a file if the translated text or the pronunciation is equal to or greater than 1024 in length
        if (translatedText.length >= 1024 || pronunciation && pronunciation.length >= 1024) {
            const buf = `Input language: ${inputLanguage}\n\nTranslated text: ${translatedText}\n\n${pronunciation ? `Pronunciation: ${pronunciation}` : ''}`;

            return message.send('Translation or pronunciation too long for Discord, have a text file instead.', { files: [{ name: `translation-${Date.now()}.txt`, attachment: Buffer.from(buf) }] });
        }

        // Create the embed
        const embed = new MessageEmbed()
            .setColor(this.client.options.config.embedHex)
            .setTitle('Google Translate')
            .addField(`Translation (Input language: ${inputLanguage})`, translatedText)
            .setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL({ size: 1024, format: 'png', dynamic: true }))
            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Google_Translate_logo.svg/480px-Google_Translate_logo.svg.png')
            .setTimestamp();

        if (pronunciation) embed.addField('Pronunciation', pronunciation);

        return message.send(embed);
    }

    async init() {

    }

};