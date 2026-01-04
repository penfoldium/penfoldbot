/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SlashCommandBooleanOption as Boolean,
  SlashCommandBuilder as Builder,
  SlashCommandNumberOption as Number,
  SlashCommandStringOption as String,
  SlashCommandSubcommandBuilder as Subcommand,
  SlashCommandUserOption as User
} from "discord.js";
import type { CustomTypeOptions } from "i18next";
import { getAllLocales, getEnglishLocale } from "../Util/Helpers.js";

type Constructor<T = object> = new (...args: any[]) => T;

function PenfoldSlashMixinBuilder<Base extends Constructor<PenfoldSlashMixin>>(Base: Base) {
  return class extends Base {
    localizeName(name: keyof CustomTypeOptions["resources"]["commands"]): this {
      this.setName(getEnglishLocale(name));
      this.setNameLocalizations(getAllLocales(name));

      return this;
    }

    localizeDescription(description: keyof CustomTypeOptions["resources"]["commands"]): this {
      this.setDescription(getEnglishLocale(description));
      this.setDescriptionLocalizations(getAllLocales(description));

      return this;
    }
  };
}

export const PenfoldSlashCommandBuilder = PenfoldSlashMixinBuilder(Builder);
export const PenfoldSlashCommandStringOption = PenfoldSlashMixinBuilder(String);
export const PenfoldSlashCommandUserOption = PenfoldSlashMixinBuilder(User);
export const PenfoldSlashCommandNumberOption = PenfoldSlashMixinBuilder(Number);
export const PenfoldSlashCommandBooleanOption = PenfoldSlashMixinBuilder(Boolean);
export const PenfoldSlashCommandSubcommandBuilder = PenfoldSlashMixinBuilder(Subcommand);

export type PenfoldSlashMixin = {
  setName(name: string): any;
  setNameLocalizations(locales: { [name: string]: string }): any;
  setDescription(name: string): any;
  setDescriptionLocalizations(locales: { [name: string]: string }): any;
};
