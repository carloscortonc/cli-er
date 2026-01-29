//TODO change to a class
const root = await navigator.storage.getDirectory();
const config = {
  CWD: "/",
};

export function getCwd() {
  return config.CWD;
}

export function setCwd(cwd) {
  config.CWD = cwd;
}

async function getDirHandle(pathOrParts, create) {
  const parts = Array.isArray(pathOrParts) ? pathOrParts : pathOrParts.split("/").filter(Boolean);
  let h = root;
  for (const part of parts) {
    h = await h.getDirectoryHandle(part, { create });
  }
  return h;
}

async function getFileHandle(path, create) {
  const parts = path.split("/").filter(Boolean);
  const dirh = await getDirHandle(parts.slice(0, parts.length - 1), create);
  return dirh.getFileHandle(parts[parts.length - 1], { create });
}

export async function writeFile(path, content) {
  const handle = await getFileHandle(path, true);
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
}

export async function readFile(path) {
  const handle = await getFileHandle(path);
  return handle.getFile().then((f) => f.text());
}

export async function readDir(path) {
  const handle = await getDirHandle(path);
  const entries = [];
  for await (const [name, value] of handle.entries()) {
    entries.push({ name, type: value.kind });
  }
  return entries;
}

// Create initial FS structure
export async function init(fileMap) {
  await root.remove();
  for (const f in fileMap) {
    await writeFile(f, fileMap[f]);
  }
}
