const Cli = require("cli-er");

module.exports = (options) => {
  console.log("Cli invoked with the following options:", options);
};

/* Custom option-parser implementation */
function dateParser(d) {
  if (isNaN(Date.parse(d))) {
    return new Date();
  }
  return new Date(d);
}

if (require.main === module) {
  new Cli({
    date: {
      description: "Date option. Format: yyyy/mm/dd",
      value: dateParser,
    },
  }).run();
}
