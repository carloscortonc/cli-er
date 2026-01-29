import * as fs from "../fs";

export const pwd = {
  definition: {},
  cliOptions: {},
  action: () => process.stdout.write(fs.getCwd()),
};
