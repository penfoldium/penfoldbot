import type { ChatInputCommandInteraction } from "discord.js";
import type { PenfoldClient } from "src/Classes/PenfoldClient.js";

export function getEmbedFooter(interaction: ChatInputCommandInteraction) {
  return {
    text: `Requested by ${interaction.user.username}`,
    iconURL: interaction.user.avatarURL()!,
  };
}

export function getBotAvatar(client: PenfoldClient) {
  return (
    client.user?.displayAvatarURL() ??
    "https://avatars.githubusercontent.com/u/49412957?s=400&u=01dfdf6c953e302f5873c284ea0dcf192df63239&v=4"
  );
}

export function sleep(ms: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
}
