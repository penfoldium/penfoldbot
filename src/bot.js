require("@sapphire/plugin-subcommands/register");
const { SapphireClient } = require("@sapphire/framework");
const config = require("./data/config");

const client = new SapphireClient({
  intents: ["GUILDS", "GUILD_MESSAGES"],
  config,
});

client.login(config.token);
