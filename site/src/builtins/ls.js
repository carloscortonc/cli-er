import * as fs from "../fs.js";

export const ls = {
  definition: {},
  cliOptions: {},
  action: async () => {
    const cwd = fs.getCwd();
    const contents = await fs.readDir(cwd);
    process.stdout.write(contents.map((c) => c.name).join("   "));
  },
};
