const Cli = require("cli-er");

module.exports = ({ testPathPattern }) => {
  console.log("List of files:", testPathPattern);
};

if (require.main === module) {
  new Cli({
    testPathPattern: {
      description: "A regexp pattern string that is matched against all tests paths",
      positional: true,
      default: [],
    },
    opt: {
      description: "Generic option",
    },
  }).run();
}
