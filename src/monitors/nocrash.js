const { Monitor } = require("klasa");

module.exports = class extends Monitor {
  constructor(...args) {
    super(...args, {
      name: "nocrash",
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
    if (
      message.content.includes(
        "\ud83c\udff3\ufe0f\u200d\u0030\ud83c\udf08" ||
          "\u0c1c\u0c4d\u0c1e\u200c\u0c3e" ||
          "\u0644\u064f\u0644\u064f\u0635\u0651\u0628\u064f\u0644\u064f\u0644\u0635\u0651\u0628\u064f\u0631\u0631\u064b\u0020\u0963\u0020\u0963\u0068\u0020\u0963\u0020\u0963\u000a\u0020\u5197"
      )
    ) {
      // The first sequence is flag-zero-rainbow, the second is the Telugu crash, the third is Effective Power but without the filler text (the crash happened when iOS tried to truncate the problematic sequence)
      message.delete();
      message.send(
        "Not cool, chief. You shouldn't mess up people's phones like that."
      );
    }
  }

  async init() {}
};
