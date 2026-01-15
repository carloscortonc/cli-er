import Cli from "../../dist/index.js";
import { apply } from "./utils.js";

export default apply;

new Cli(
  {
    file: {
      type: "string",
      description: 'File to read. Use "-" for stdin',
      positional: 0,
      stdin: true,
      required: true,
    },
    lines: { type: "number", description: "Number of lines to output", aliases: ["n"], default: 10 },
  },
  {
    cliDescription: "Display the last part of a file",
  },
).run();
