import fs from "../fs.js";
import { F_MODE } from "../kernel/permission.js";
import pathmodule from "../path.js";

export const ls = {
  definition: {
    files: { type: "string", positional: true, default: [] },
    long: { type: "boolean", aliases: ["l"], description: "List files in the long format" },
    all: {
      type: "boolean",
      aliases: ["a"],
      description: " Include directory entries whose names begin with a dot (`.`)",
    },
  },
  cliOptions: {},
  action: async (params) => {
    const rfiles = params.files.length ? params.files : ["."];
    const fps = rfiles.map((f) => pathmodule.resolve(pathmodule.getCwd(), f));
    const files = await Promise.all(fps.map((fp) => fs.info(fp).then((r) => [fp, r])));
    // Log error for not-found locations
    for (const f of files.filter((e) => !e[1])) {
      Cli.logger.error("No such file or directory: ".concat(f[0]));
      process.exitCode = 1;
    }
    // List contents for requested files
    const efiles = files.filter((e) => e[1]).map((e) => ({ ...e[1], path: e[0] }));
    for (let i = 0; i < efiles.length; i++) {
      const f = efiles[i];
      const contents =
        f.type == "file"
          ? [f]
          : await fs.readDir(f.path).then((r) => r.filter((e) => !e.name.startsWith(".") || params.all));
      // Include section title if type=directory & files>1
      const title = f.type == "directory" && files.length > 1 ? f.path.concat(":\n") : "";
      let filesf = "";
      if (params.long) {
        filesf = contents
          .map((c) => `${format_permissions(c)}@   ${c.metadata.u} ${format_date(c)}  ${c.name}`)
          .join("\n");
      } else {
        filesf = contents.map((c) => c.name).join("   ");
      }

      process.stdout.write("".concat(title, filesf, i < efiles.length - 1 ? "\n\n" : ""));
    }
  },
};

const format_permissions = (e) => {
  const p = e.metadata.p;
  return [
    [e.type === "directory", "d"],
    [p & F_MODE.READ, "r"],
    [p & F_MODE.WRITE, "w"],
    [p & F_MODE.EXECUTE, "x"],
  ]
    .map((e) => (e[0] ? e[1] : "-"))
    .join("");
};

const format_date = (e) => {
  const date = new Date(e.metadata.d);
  const year = date.getFullYear();
  const currentYear = new Date().getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2);
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  return `${month} ${day} ${year === currentYear ? time : ` ${year}`}`;
};
