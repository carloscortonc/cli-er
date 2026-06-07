// Use "globaThis" so `/definition.js` is compatible with the web
globalThis.Cli = require("cli-er");
const { default: docker } = require("./definition");

new Cli(docker.definition, {
  ...docker.cliOptions,
  logger: {
    error: (...message) => process.stderr.write("\x1b[31mERROR ".concat(message.join(" "), "\x1b[0m")),
  },
}).run();
