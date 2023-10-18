import Cli from "../../../dist/index.js";
import { definition, options } from "../load-test-params.js";

//@ts-ignore
new Cli(definition, options).run();
