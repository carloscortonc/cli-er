/** Class implementing the ICliLogger interface */
export default class CliLogger {
  static log = (...message: any[]) => {
    process.stdout.write("".concat(message.join("")));
  };
  static error = (...message: any[]) => {
    process.stderr.write("ERROR ".concat(message.join("")));
  };
}
