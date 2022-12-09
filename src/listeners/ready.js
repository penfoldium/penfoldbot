const { Listener } = require("@sapphire/framework");

class ReadyListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
    });
  }

  async run() {
    const { embedHex } = this.container.client.options.config;

    if (!embedHex) {
      this.container.client.emit(
        "wtf",
        "Embed color not provided in the configuration file, falling back to a default one."
      );
      this.container.client.options.config.embedHex = "2e7da4";
    }

    if (!this.container.client.user) return;
    console.log(
      `Successfully logged in as ${this.container.client.user.tag}. Ready to serve ${this.container.client.guilds.cache.size} guilds with a total of ${this.container.client.users.cache.size} users.`
    );
    await this.container.client.user.setActivity("Danger Mouse | /hello", {
      type: "WATCHING",
    });
    await this.container.client.user.setStatus("dnd");
  }
}

module.exports = {
  ReadyListener,
};
