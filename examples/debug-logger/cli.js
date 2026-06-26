import Cli from "../../dist/index.js";

const debug = Cli.debug("cli");
const debug2 = Cli.debug("cli::2");

Cli.logger.log("Cli!\n");
debug("Some message");
debug2("Some other message");
