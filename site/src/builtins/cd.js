import fs from "../fs.js";
import pathmodule from "../path.js";

export const cd = {
  definition: { path: { type: "string", positional: 0 } },
  cliOptions: {},
  action: async ({ path }) => {
    if (!path) return;
    const fp = pathmodule.resolve(pathmodule.getCwd(), path);
    const e = await fs.info(fp);
    if (!e || e.type !== "directory") {
      const m = !e ? "not such file or directory" : "not a directory";
      Cli.logger.error(m.concat(": ", path));
      return process.exit(1);
    }
    return pathmodule.setCwd(fp);
  },
};
