import { ICliLogger } from "./types";

/** Class implementing the ICliLogger interface */
export default class CliLogger implements ICliLogger {
  log = (...message: any[]) => {
    process.stdout.write("".concat(message.join(" ")));
  };
  error = (...message: any[]) => {
    process.stderr.write("ERROR ".concat(message.join(" ")));
  };
}
