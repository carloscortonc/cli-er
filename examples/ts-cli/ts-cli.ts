import Cli from "cli-er";
import path from "path";

new Cli(
  {
    nms: {
      kind: "namespace",
      description: "Namespaces allow us to organize similar commands",
      options: {
        cmd: {
          kind: "command",
          description: "Commands receive the processed options and execute some logic with them",
        },
      },
    },
    debug: {
      type: "boolean",
      default: false,
      description: "Global option shared across all commands",
    },
  },
  {
    baseScriptLocation: path.join(__dirname, "scripts"),
    rootCommand: false,
  },
).run();
