const Cli = require("cli-er");
const path = require("path");

module.exports = (options) => {
  console.log("Cli invoked with the following options:", options);
};

if (require.main === module) {
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
    opt: {
      aliases: ["-o", "--opt"],
      type: "number",
      description: "Generic option",
    },
  }).run();
}
