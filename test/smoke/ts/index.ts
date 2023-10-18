import Cli from "../../../dist";
import definition from "../definition.json";
import options from "../options.json";

//@ts-ignore
new Cli(definition, options).run();
