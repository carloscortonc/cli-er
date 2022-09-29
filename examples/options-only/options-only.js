const Cli = require("cli-er");
const path = require("path");

new Cli({
  path: {
    description: "Location where the command will be applied",
    default: ".",
    value: (p) => {
      if (!path.isAbsolute(p)) {
        return path.join(process.cwd(), p);
      }
      return p;
    },
  },
}).run();
