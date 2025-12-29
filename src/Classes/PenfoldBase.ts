import { type PenfoldClient } from "./PenfoldClient.js";

export abstract class PenfoldBase {
  client: PenfoldClient;
  name: string;

  constructor(client: PenfoldClient, options: BaseOptions) {
    this.client = client;

    if (!options.name) throw new Error("Name property missing");
    this.name = options.name;
  }

  public abstract run(...args: any[]): any;
}

export type BaseOptions = {
  name: string;
};
