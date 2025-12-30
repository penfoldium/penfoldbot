import { Client, Collection, type ClientOptions } from "discord.js";
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
  debug: (args: any) => void = () => null;

  constructor(options: PenfoldClientOptions) {
    super(options);

    this.commands = new Collection();
    this.events = new Collection();
    this.tasks = new Collection();
    this.dev = process.env["DEV"]?.toLowerCase() == "true";

    this.db = options.db;

    if (process.env["DEBUG"]?.toLowerCase() == "true" || this.dev == true) {
      this.debug = (str: any) => console.debug(`[PenfoldDebug] ${str}`);
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
  async loadCommands(dir: string = "commands") {
    await this.#loadClasses(dir, "commands");
    return this;
  }

  /**
   * Load events into memory
   * @param {string} dir Custom folder for commands
   */
  async loadEvents(dir: string = "events") {
    await this.#loadClasses(dir, "events");
    return this;
  }

  /**
   * Load tasks into memory
   * @param {string} dir Custom folder for tasks
   */
  async loadTasks(dir: string = "tasks") {
    await this.#loadClasses(dir, "tasks");
    return this;
  }

  async #loadClasses(dir: string, collection: CollectionType) {
    if (!dir)
      throw new Error(
        `Can't load ${collection} into memory, no directory provided`
      );
    if (!collection)
      throw new Error("Can't load classes into memory, no collection provided");

    const start = performance.now();

    const directory = join(import.meta.dirname, "../", dir);
    // Make sure directory exists
    await mkdir(directory, { recursive: true });

    const files = (
      await readdir(join(import.meta.dirname, "..", dir), {
        recursive: true,
      })
    ).filter((file) => file.endsWith(".js"));

    // Make sure collection is empty before loading
    this[collection].clear();

    for (const file of files) {
      const { default: importedClass } = await import(
        "file://" + join(directory, file)
      );
      const initClass = new importedClass(this);
      if (!("name" in initClass))
        throw new Error(
          `${file} from ${collection} collection has no name property`
        );
      if (!("run" in initClass))
        throw new Error(
          `${file} from ${collection} collection has no run function`
        );

      // Check for duplicates
      if (this[collection].has(initClass.name))
        throw new Error(
          `Can't have multiple ${collection} with the same name (duplicate(s): ${initClass.name})`
        );

      this[collection].set(initClass.name, initClass);

      if (collection == "tasks") (initClass as PenfoldTask).setup();
      if (collection == "events") (initClass as PenfoldEvent).setup();
    }

    const size = this[collection].size;
    const time = (performance.now() - start).toFixed(2);

    console.log(
      `[PenfoldClient] Loaded ${size} classes into ${collection} in ${time}ms`
    );
  }
}

export { PenfoldClient };

export type CollectionType = "commands" | "events" | "tasks";

export type PenfoldClientOptions = ClientOptions & {
  db: PrismaClient;
};
