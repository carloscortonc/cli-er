const Cli = require("cli-er");

/**
 * @typedef {import("cli-er").ValueParserInput} ValueParserInput
 */

module.exports = (options) => {
  console.log("Cli invoked with the following options:", options);
};

/* Custom option-parser implementation */
/** @param {ValueParserInput} */
function dateParser({ value, format, option }) {
  if (isNaN(Date.parse(value))) {
    return { error: format("option_wrong_value", option.key, "yyyy/mm/dd", value) };
  }
  return { value: new Date(value) };
}

if (require.main === module) {
  new Cli({
    date: {
      description: "Date option. Format: yyyy/mm/dd",
      parser: dateParser,
    },
  }).run();
}
