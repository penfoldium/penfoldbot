const { Monitor } = require('klasa');

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            name: 'nocrash',
            enabled: true,
            ignoreBots: false,
            ignoreSelf: true,
            ignoreOthers: false,
            ignoreWebhooks: true,
            ignoreEdits: false,
            ignoreBlacklistedUsers: true,
            ignoreBlacklistedGuilds: true
        });
    }

    async run(message) {
        if (['\ud83c\udff3\ufe0f\u200d\u0030\ud83c\udf08',
            '\u0c1c\u0c4d\u0c1e\u200c\u0c3e',
            '\u0644\u064f\u0644\u064f\u0635\u0651\u0628\u064f\u0644\u064f\u0644\u0635\u0651\u0628\u064f\u0631\u0631\u064b\u0020\u0963\u0020\u0963\u0068\u0020\u0963\u0020\u0963\u000a\u0020\u5197',
            '\u0628\u064d\u064d\u064d\u064d\u064e\u064e\u064f\u064f\u064f\u0650\u0651\u0651\u0651\u0652\u0631\u064d\u064d\u064d\u064d\u064e\u064e\u064f\u064f\u0650\u0650\u0651\u0651\u0651\u0652\u0622\u064d\u064d\u064d\u064e\u064f\u0651'
        ].some(string => message.content.includes(string))) {
            // The first sequence is flag-zero-rainbow, the second is the Telugu crash
            // The third is Effective Power but without the filler text (the crash happened when iOS tried to truncate the problematic sequence)
            // The fourth is the Sindhi crash (without emoji, I believe the emoji is what makes it 'lethal'? Since I've seen a version with the microbe emoji and one with the Italy flag emoji I didn't include any emoji as a catch-all)
            // If these strings can be optimized (to avoid false positives and false negatives) feel free to contribute! 
            message.delete();
            message.send("Not cool, chief. You shouldn't mess up people's phones like that.");
        }
    }

    async init() {

    }

};