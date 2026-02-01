import fs from "../fs.js";
import pathmodule from "../path.js";

export const ls = {
  definition: { files: { type: "string", positional: true, default: [] } },
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
      const contents = f.type == "file" ? [{ name: f.name }] : await fs.readDir(f.path);
      // Include section title if type=directory & files>1
      const title = f.type == "directory" && files.length > 1 ? f.path.concat(":\n") : "";
      process.stdout.write(
        "".concat(title, contents.map((c) => c.name).join("   "), i < efiles.length - 1 ? "\n\n" : ""),
      );
    }
  },
};
