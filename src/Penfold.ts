import { GatewayIntentBits } from "discord.js";
import { PenfoldClient } from "./Classes/PenfoldClient.js";

const client = new PenfoldClient({
  intents: [GatewayIntentBits.Guilds],
});

await client.loadAll();
await client.login(process.env["TOKEN"]);
