import pathmodule from "./path.js";

const databaseName = "cliersh";
const storeName = "entries";

class FileSystem {
  database = null;
  stdin = "";
  // Pending write operation
  wp = Promise.resolve();

  #path(path) {
    return "/".concat(path.split("/").filter(Boolean).join("/")) || "/";
  }

  async #db() {
    if (this.database) return this.database;
    this.database = await new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: "path" });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.database;
  }

  async #read(method, value) {
    const database = await this.#db();
    return new Promise((resolve, reject) => {
      const request = database.transaction(storeName).objectStore(storeName)[method](value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async #entries() {
    return this.#read("getAll");
  }

  async #entry(path) {
    return this.#read("get", this.#path(path));
  }

  async #write(method, value) {
    const database = await this.#db();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, "readwrite");
      transaction.objectStore(storeName)[method](value);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  async #put(entry) {
    return this.#write("put", entry);
  }

  async #delete(path) {
    return this.#write("delete", this.#path(path));
  }

  async #ensureDirectories(path) {
    const parts = this.#path(path).split("/").filter(Boolean);
    parts.pop();
    for (let index = 1; index <= parts.length; index++) {
      const directory = "/".concat(parts.slice(0, index).join("/"));
      const entry = await this.#entry(directory);
      if (entry?.type === "file") throw new Error(`${directory} is not a directory`);
      if (!entry) await this.#put({ path: directory, type: "directory" });
    }
  }

  async #directoryExists(path) {
    const directory = this.#path(path);
    if (directory === "/") return true;
    if ((await this.#entry(directory))?.type === "directory") return true;
    return (await this.#entries()).some((entry) => entry.path.startsWith(`${directory}/`));
  }

  #enqueue(operation) {
    const pending = this.wp.then(operation);
    this.wp = pending.catch(() => {});
    return pending;
  }

  async writeFile(path, content, opts = {}) {
    return this.#enqueue(async () => {
      const file = this.#path(path);
      const existing = opts.concat ? await this.#entry(file) : undefined;
      await this.#ensureDirectories(file);
      await this.#put({
        path: file,
        type: "file",
        content: `${opts.concat ? existing?.content || "" : ""}${content}`,
        metadata: opts.metadata || existing?.metadata || {},
      });
    });
  }

  async readFile(path) {
    await this.wp;
    const entry = await this.#entry(path);
    if (entry?.type !== "file") throw new Error(`No such file: ${path}`);
    return entry.content;
  }

  async deleteFile(path) {
    return this.#enqueue(() => this.#delete(path));
  }

  async createDir(path, create) {
    const directory = this.#path(path);
    if (await this.#directoryExists(directory)) return;
    if (!create) throw new Error(`No such directory: ${directory}`);
    return this.#enqueue(async () => {
      const parts = directory.split("/").filter(Boolean);
      for (let index = 1; index <= parts.length; index++) {
        await this.#put({ path: "/".concat(parts.slice(0, index).join("/")), type: "directory" });
      }
    });
  }

  async info(path) {
    const target = this.#path(path);
    if (target === "/") return { type: "directory", name: target };
    const entry = await this.#entry(target);
    if (entry) return { type: entry.type, name: pathmodule.basename(target) };
    if (await this.#directoryExists(target)) return { type: "directory", name: pathmodule.basename(target) };
  }

  async getFileMetadata(path) {
    return (await this.#entry(path))?.metadata || {};
  }

  readFileSync(pathOrFd) {
    return pathOrFd === 0 ? this.stdin : "";
  }

  setStdin(content) {
    this.stdin = content || "";
  }

  async readDir(path) {
    await this.wp;
    const directory = this.#path(path);
    if (!(await this.#directoryExists(directory))) throw new Error(`No such directory: ${directory}`);
    const prefix = directory === "/" ? "/" : `${directory}/`;
    const result = new Map();
    for (const entry of await this.#entries()) {
      if (!entry.path.startsWith(prefix) || entry.path === directory) continue;
      const [name, ...remaining] = entry.path.slice(prefix.length).split("/");
      result.set(name, { name, type: remaining.length ? "directory" : entry.type });
    }
    return [...result.values()];
  }

  async init(fileMap) {
    return this.#enqueue(async () => {
      for (const [path, content] of Object.entries(fileMap)) {
        const file = this.#path(path);
        if (await this.#entry(file)) continue;
        await this.#ensureDirectories(file);
        await this.#put({ path: file, type: "file", content, metadata: {} });
      }
    });
  }
}

const fs = new FileSystem();

export default fs;
