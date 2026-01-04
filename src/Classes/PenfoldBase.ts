import i18next from "i18next";
import { type PenfoldClient } from "./PenfoldClient.js";

export abstract class PenfoldBase {
  client: PenfoldClient;
  name: string;

  constructor(client: PenfoldClient, options: BaseOptions) {
    this.client = client;

    if (!options.name) throw new Error(i18next.t("errors:NO_NAME_PROVIDED"));
    this.name = options.name;
  }

  public abstract run(...args: unknown[]): unknown;
}

export type BaseOptions = {
  name: string;
};
