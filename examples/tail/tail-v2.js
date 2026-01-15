import Cli from "../../dist/index.js";
import { apply } from "./utils.js";
import fs from "fs";

export default function ({ file: rawfile, lines }) {
  let file = rawfile;
  // Check if stdin is available, and read contents from it
  if (!process.stdin.isTTY) {
    file = fs.readFileSync(0, "utf-8");
  }
  return apply({ file, lines });
}

new Cli(
  {
    file: {
      type: "string",
      description: 'File to read. Use "-" for stdin',
      positional: 0,
      // We cannot mark it as required, in order to avoid providing "-" value and reading directly from stdin
      required: false,
    },
    lines: { type: "number", description: "Number of lines to output", aliases: ["n"], default: 10 },
  },
  {
    cliDescription: "Display the last part of a file",
  },
).run();
