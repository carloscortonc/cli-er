const Cli = require("cli-er");
const path = require("path");

module.exports = (options) => {
  console.log("Cli invoked with the following options:", options);
};

if (require.main === module) {
  new Cli({
    path: {
      description: "Location where the command will be applied",
      default: process.cwd(),
      parser: ({ value: v, current }) => {
        // "current" in this case is the default value defined
        const p = v || current;
        const value = !path.isAbsolute(p) ? path.join(process.cwd(), p) : p;
        return { value };
      },
    },
    opt: {
      aliases: ["-o", "--opt"],
      type: "number",
      description: "Generic option",
    },
  }).run();
}
