import path from "path";
import os from "os";
import fs from "fs";

export function apply({ file, lines }) {
  const p = !file || path.isAbsolute(file) ? file : path.join(process.cwd(), file);
  let content = file;
  if (fs.existsSync(p)) {
    content = fs.readFileSync(p, "utf-8");
  }
  process.stdout.write(
    content
      .split(os.EOL)
      .slice((lines + 1) * -1)
      .join(os.EOL),
  );
}
