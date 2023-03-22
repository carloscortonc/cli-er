const Cli = require("../..");

module.exports = () => {
  console.log("[CJS] Invoked cli");
}

if (require.main === module) {
  new Cli({
    debug: {}
  }).run();
}