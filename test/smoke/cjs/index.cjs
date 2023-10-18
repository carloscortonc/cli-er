const Cli = require("../../..");
const definition = require("../definition.json");
const options = require("../options.json");

//@ts-ignore
new Cli(definition, options).run();
