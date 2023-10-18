import Cli from "../../../dist";
import { definition, options } from "../load-test-params";

//@ts-ignore
new Cli(definition, options).run();
