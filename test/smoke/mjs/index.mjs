//@ts-nocheck
import Cli from "../../../dist/index.js";
import definition from "../definition.json" assert { type: "json" };
import options from "../options.json" assert { type: "json" };

new Cli(definition, options).run();
