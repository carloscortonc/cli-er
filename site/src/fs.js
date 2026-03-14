import kernel from "./kernel";
import pathmodule from "./path.js";

const root = await navigator.storage.getDirectory();

class FileSystem {
  // Store a dedicated handle for stdin fd (stdout and stderr are sent to main thread) to be used in `readFileSync`
  stdinHandle = null;
  // Pending write operation
  wp = Promise.resolve();

  async #getDirHandle(pathOrParts, create) {
    const parts = Array.isArray(pathOrParts) ? pathOrParts : pathOrParts.split("/").filter(Boolean);
    let h = root;
    for (const part of parts) {
      h = await h.getDirectoryHandle(part, { create });
    }
    return h;
  }

  async #getFileHandle(path, create) {
    const parts = path.split("/").filter(Boolean);
    const dirh = await this.#getDirHandle(parts.slice(0, parts.length - 1), create);
    return dirh.getFileHandle(parts[parts.length - 1], { create });
  }

  getProcessFdPath(fd) {
    return `/proc/${kernel.getpid()}/fd/${fd}`;
  }

  async writeFile(path, content, opts = {}) {
    this.wp = this.wp.then(() => this.#writeFile(path, content, opts));
    return this.wp;
  }

  async readFile(path) {
    await this.wp;
    return this.#readFile(path);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system#deleting_a_file_or_folder
  async deleteFile(path) {
    await this.wp;
    const h = await this.#getFileHandle(path);
    return h.remove();
  }

  async createDir(path, create) {
    const parts = path.split("/").filter(Boolean);
    const existsParent = await this.#getDirHandle(parts.slice(0, parts.length - 1), false).catch(() => false);
    return this.#getDirHandle(path, create || existsParent);
  }

  async info(path) {
    const target = pathmodule.basename(path);
    const parent = pathmodule.resolve(path, "..");
    if (parent == path) {
      return { type: "directory", name: path };
    }
    const dir = await this.readDir(parent);
    return dir.find((e) => e.name === target);
  }

  async #readFile(path) {
    const handle = await this.#getFileHandle(path);
    return handle
      .getFile()
      .then((f) => f.text())
      .then((r) => {
        return r.slice(r.indexOf("\n") + 1);
      });
  }

  async #writeFile(path, content, opts) {
    let c;
    // Check if file needs to be read (regenerating metadata)
    if (opts.metadata || !opts.concat) {
      const e = opts.concat ? await this.#readFile(path) : "";
      c = `${JSON.stringify(opts.metadata || {})}\n${e}${content}`;
    } else {
      c = content;
    }
    return this.#writeRawFileContent(path, c, opts);
  }

  /** Get file metadata by reading stream until a "\n" is found */
  async getFileMetadata(path) {
    const reader = (await this.#getFileHandle(path).then((h) => h.getFile())).stream().getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) return buffer;
      buffer += decoder.decode(value, { stream: true });
      if (buffer.indexOf("\n") !== -1) break;
    }
    try {
      return JSON.parse(buffer.slice(0, buffer.indexOf("\n")));
    } catch {
      return {};
    }
  }

  async #writeRawFileContent(path, content, opts) {
    const handle = await this.#getFileHandle(path, true);
    const position = opts.concat ? (await handle.getFile()).size : undefined;
    const writable = await handle.createWritable({ keepExistingData: opts.concat });
    await writable.write({ type: "write", data: content, position });
    await writable.close();
  }

  /** Compatibility method with original `fs.readFileSync`
   * If a number is provided, treat it as file-descriptor, and read from `/proc/{PID}/fd/{fd}`
   * We will assume the only fd requested will be 0 (used by cli-er)
   */
  readFileSync(pathOrFd) {
    if (typeof pathOrFd === "string") {
      return "";
    }
    if (pathOrFd !== 0) {
      return "";
    }
    const fileSize = this.stdinHandle.getSize();
    const buffer = new DataView(new ArrayBuffer(fileSize));
    this.stdinHandle.read(buffer, { at: 0 });
    const content = new TextDecoder("utf-8").decode(new Uint8Array(buffer.buffer));
    return content.slice(content.indexOf("\n"));
  }

  async readDir(path) {
    const handle = await this.#getDirHandle(path);
    const entries = [];
    for await (const [name, value] of handle.entries()) {
      entries.push({ name, type: value.kind });
    }
    return entries;
  }

  /** Create initial FS structure */
  async init(fileMap) {
    // TODO change to `removeEntry()` for compatibility
    await root.remove().catch(() => {});
    for (const f in fileMap) {
      await this.writeFile(f, fileMap[f]);
    }
  }

  // Create a stdin handle for web-worker
  async wwPrepareStdinHandle() {
    this.stdinHandle = await this.#getFileHandle(this.getProcessFdPath(0), true).then((h) =>
      h.createSyncAccessHandle(),
    );
    // Return cleanup function
    return () => this.stdinHandle.close();
  }
}

const fs = new FileSystem();

export default fs;
