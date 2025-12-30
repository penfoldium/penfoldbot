import { GatewayIntentBits } from "discord.js";
import { PenfoldClient } from "./Classes/PenfoldClient.js";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);

const client = new PenfoldClient({
  intents: [GatewayIntentBits.Guilds],
});

await client.loadAll();
await client.login(process.env["TOKEN"]);
