import { Client, Collection, type ClientOptions } from "discord.js";
import i18next from "i18next";
import ms from "ms";
import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { PrismaClient } from "../../db/prisma/client.js";
import type { PenfoldCommand } from "./PenfoldCommand.js";
import type { PenfoldEvent } from "./PenfoldEvent.js";
import type { PenfoldTask } from "./PenfoldTask.js";

class PenfoldClient extends Client {
  owners: string[] = [];
  /** Collection containing all commands and their initialized classes */
  commands: Collection<string, PenfoldCommand>;
  /** Collection containing all events and their initialized classes */
  events: Collection<string, PenfoldEvent>;
  /** Collection containing all tasks and their initialized classes */
  tasks: Collection<string, PenfoldTask>;
  /** Whether or not the client is run with the DEV=true env variable */
  dev: boolean;
  db: PrismaClient;
  debug: (...args: unknown[]) => void = () => null;

  constructor(options: PenfoldClientOptions) {
    super(options);

    this.commands = new Collection();
    this.events = new Collection();
    this.tasks = new Collection();
    this.dev = process.env["DEV"]?.toLowerCase() == "true";

    this.db = options.db;

    if (process.env["DEBUG"]?.toLowerCase() == "true" || this.dev == true) {
      this.debug = (...args: unknown[]) => console.debug(`[PenfoldDebug]`, ...args);
    }
  }

  /** Loads all Penfold components at once */
  async loadAll() {
    await this.loadCommands();
    await this.loadEvents();
    await this.loadTasks();
    return this;
  }

  /**
   * Load commands into memory
   * @param dir Custom directory for commands
   */
  async loadCommands(dir: string = "Commands") {
    await this.#loadClasses(dir, "commands");
    return this;
  }

  /**
   * Load events into memory
   * @param {string} dir Custom folder for commands
   */
  async loadEvents(dir: string = "Events") {
    await this.#loadClasses(dir, "events");
    return this;
  }

  /**
   * Load tasks into memory
   * @param {string} dir Custom folder for tasks
   */
  async loadTasks(dir: string = "Tasks") {
    await this.#loadClasses(dir, "tasks");
    return this;
  }

  async #loadClasses(dir: string, collection: CollectionType) {
    if (!dir)
      throw new Error(
        i18next.t("errors:NO_DIRECTORY_COLLECTION", {
          collection
        })
      );
    if (!collection) throw new Error(i18next.t("errors:NO_COLLECTION_PROVIDED"));

    const start = performance.now();

    const directory = join(import.meta.dirname, "../", dir);
    // Make sure directory exists
    await mkdir(directory, { recursive: true });

    const files = (
      await readdir(join(import.meta.dirname, "..", dir), {
        recursive: true
      })
    ).filter(file => file.endsWith(".js"));

    // Make sure collection is empty before loading
    this[collection].clear();

    for (const file of files) {
      const { default: importedClass } = await import("file://" + join(directory, file));
      const initClass = new importedClass(this);
      if (!("run" in initClass))
        throw new Error(i18next.t("errors:NO_RUN_COLLECTION", { collection, file }));

      // Check for duplicates
      if (this[collection].has(initClass.name))
        throw new Error(
          i18next.t("errors:MULTIPLE_COLLECTION_SAME_NAME", {
            name: initClass.name,
            collection
          })
        );

      this[collection].set(initClass.name, initClass);

      if (collection == "tasks") (initClass as PenfoldTask).setup();
      if (collection == "events") (initClass as PenfoldEvent).setup();
    }

    const size = this[collection].size;
    const time = ms(Number((performance.now() - start).toFixed(2)));

    console.log(i18next.t("client:CLIENT_LOADED", { size, time, collection }));
  }
}

export { PenfoldClient };

export type CollectionType = "commands" | "events" | "tasks";

export type PenfoldClientOptions = ClientOptions & {
  db: PrismaClient;
};
