import Cli from "cli-er";
import { definition, cliOptions } from "./definition.js";

new Cli(definition, cliOptions).run();
