import fs from "../fs";
import pathmodule from "../path";

export const cat = {
  definition: { path: { type: "string", positional: 0 } },
  cliOptions: {},
  action: async ({ path }) => {
    if (!path) return;
    const fp = pathmodule.resolve(pathmodule.getCwd(), path);
    const e = await fs.info(fp);
    if (!e || e.type !== "file") {
      const m = !e ? "not such file or directory" : "is a directory";
      Cli.logger.error(m.concat(": ", path));
      return process.exit(1);
    }
    return fs.readFile(fp).then(process.stdout.write);
  },
};
