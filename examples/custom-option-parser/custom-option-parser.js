const Cli = require("cli-er");

/**
 * @typedef {import("cli-er").ValueParserInput} ValueParserInput
 */

module.exports = (options) => {
  console.log("Cli invoked with the following options:", options);
};

/* Custom option-parser implementation */
/** @param {ValueParserInput} */
function dateParser({ value, option }) {
  if (isNaN(Date.parse(value))) {
    return {
      error: Cli.formatMessage("option_wrong_value", { option: option.key, expected: "yyyy/mm/dd", found: value }),
    };
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
