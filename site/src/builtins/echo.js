import { scapeColor } from "../renderer";
export const echo = {
  definition: { args: { type: "string", positional: true, stdin: true } },
  cliOptions: { help: { hidden: true } },
  action: ({ args }) => {
    if (!args) return;
    // Escape "clear" sequence to avoid being interpreted as color
    Cli.logger.log(scapeColor(args.join(" ")), "\n");
  },
};
