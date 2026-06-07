import path from "../path";

export const pwd = {
  definition: {},
  cliOptions: {},
  action: () => process.stdout.write(path.getCwd()),
};
