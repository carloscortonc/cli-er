//@ts-nocheck
import Cli from "../../../dist/index.js";
import definition from "../definition.json";
import options from "../options.json";

new Cli(definition, options).run();
