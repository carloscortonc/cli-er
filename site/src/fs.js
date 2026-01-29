const root = await navigator.storage.getDirectory();

class FileSystem {
  cwd = "/";

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
  }
}

const fs = new FileSystem();

export default fs;
