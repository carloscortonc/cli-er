const Cli = require("../../..");
const { definition, options } = require("../load-test-params");

//@ts-ignore
new Cli(definition, options).run();
