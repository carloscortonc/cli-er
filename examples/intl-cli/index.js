const Cli = require("cli-er");

const intlcliConfig = require("./.intlclirc");
const supportedLocales = ["en", "es"];

const locale = supportedLocales.includes(intlcliConfig.lang) ? intlcliConfig.lang : "en";
const messages = require(`./intl/${locale}.json`);

module.exports = () => {
  console.log(Cli.formatMessage("greetings"));
};

if (require.main === module) {
  new Cli({ cmd: { options: { opt: {} } } }, { messages, version: { hidden: false } }).run();
}
