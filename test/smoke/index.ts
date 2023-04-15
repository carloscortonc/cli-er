import Cli from "../..";

module.exports = () => {
  console.log("[TS]  Invoked cli");
};

if (require.main === module) {
  new Cli({
    debug: {},
  }).run();
}
