import fs from "../fs.js";
import pathmodule from "../path.js";

export const rm = {
  definition: {
    files: { type: "string", positional: true, required: true },
    dir: {
      type: "boolean",
      aliases: ["d"],
      description: "Attempt to remove directories as well as other types of files",
    },
    recursive: {
      type: "boolean",
      aliases: ["r", "R"],
      description:
        "Attempt to remove the file hierarchy rooted in each file argument. The -R option implies the -d option",
    },
  },
  cliOptions: {},
  action: async (params) => {
    for (const p of params.files) {
      const fp = pathmodule.resolve(pathmodule.getCwd(), p);
      const e = await fs.info(fp);
      if (!e) {
        Cli.logger.error(p.concat(": No such file or directory"));
        process.exitCode = 1;
        continue;
      }
      const dir = params.dir | params.recursive;
      if (e.type === "directory" && !dir) {
        Cli.logger.error(p.concat(": is a directory"));
        process.exitCode = 1;
        continue;
      }
      if (e.type === "directory" && !params.recursive && (await fs.readDir(p).then((r) => r.length))) {
        Cli.logger.error(p.concat(": Directory not empty"));
        process.exitCode = 1;
        continue;
      }
      await fs.delete(p, { recursive: e.type === "directory" && dir });
    }
  },
};
