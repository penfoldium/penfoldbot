import type { ButtonInteraction, ChatInputCommandInteraction, Client } from "discord.js";
import type { CustomTypeOptions } from "i18next";
import i18next from "i18next";
import type { PenfoldClient } from "../Classes/PenfoldClient.js";

export function getEmbedFooter(interaction: ChatInputCommandInteraction) {
  return {
    text: `Requested by ${interaction.user.username}`,
    iconURL: interaction.user.avatarURL()!
  };
}

export function getBotAvatar(client: PenfoldClient | Client<true>) {
  return (
    client.user?.displayAvatarURL() ??
    "https://avatars.githubusercontent.com/u/49412957?s=400&u=01dfdf6c953e302f5873c284ea0dcf192df63239&v=4"
  );
}

export function sleep(ms: number): Promise<void> {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, ms);
  });
}

export function getAllLocales(cmd: LocaleKey) {
  const languages = i18next.languages;
  const localizations: { [language: string]: string } = {};

  for (const language of languages) {
    localizations[language] = i18next.t(`${cmd}`);
  }

  return localizations;
}

export function getEnglishLocale(cmd: LocaleKey) {
  return i18next.t(cmd, { lng: "en-US" });
}

export function getLocaleString(
  locale: LocaleKey,
  interaction: ChatInputCommandInteraction | ButtonInteraction,
  options?: { [option: string]: unknown }
) {
  return i18next.t(locale, { lng: interaction.locale, ...options });
}

type LocaleKey = keyof CustomTypeOptions["resources"]["commands"];
