require("@sapphire/plugin-subcommands/register");
const { SapphireClient, BucketScope } = require("@sapphire/framework");
const config = require("./data/config");

const client = new SapphireClient({
  intents: ["GUILDS", "GUILD_MESSAGES"],
  defaultCooldown: {
    delay: 10_000,
    filteredCommands: ["ping"],
    scope: BucketScope.User,
  },
  config,
});

client.login(config.token);
