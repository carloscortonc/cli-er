import fs from "../fs";
import path from "../path";

export const mkdir = {
  definition: {
    names: { positional: true, description: "List of directory names" },
    createIntermediate: {
      type: "boolean",
      default: false,
      aliases: ["p"],
      description: "Create intermediate directories as required",
    },
  },
  cliOptions: {},
  action: async (params) =>
    Promise.all(
      params.names.map((n) =>
        fs.createDir(path.resolve(path.getCwd(), n), params.createIntermediate).catch(() => {
          Cli.logger.error(`No such file or directory: ${n}\n`);
        }),
      ),
    ),
};
