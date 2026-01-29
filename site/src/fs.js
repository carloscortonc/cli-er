import kernel from "./kernel.js";

const root = await navigator.storage.getDirectory();

class FileSystem {
  cwd = "/";
  // Store a dedicated handle for stdin fd (`/proc/{PID}/fd/0`) to be used in `readFileSync`
  stdinHandle = null;

  getCwd() {
    return this.cwd;
  }

  setCwd(cwd) {
    this.cwd = cwd;
  }

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

  async writeFile(path, content) {
    const handle = await this.#getFileHandle(path, true);
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  async readFile(path) {
    const handle = await this.#getFileHandle(path);
    return handle.getFile().then((f) => f.text());
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
    return new TextDecoder("utf-8").decode(new Uint8Array(buffer.buffer));
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
    await root.remove();
    for (const f in fileMap) {
      await this.writeFile(f, fileMap[f]);
    }
    // Create empty fd=0 file
    await this.writeFile(this.getProcessFdPath(0), "");
  }

  // Create a stdin handle for web-worker
  async wwPrepareStdinHandle() {
    this.stdinHandle = await this.#getFileHandle(this.getProcessFdPath(0)).then((h) => h.createSyncAccessHandle());
    // Return cleanup function
    return () => this.stdinHandle.close();
  }
}

const fs = new FileSystem();

export default fs;
