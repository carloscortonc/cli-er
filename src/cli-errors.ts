/** Existing error messages */
export enum ErrorType {
  COMMAND_NOT_FOUND = 'Command "{0}" not found. Did you mean "{1}" ?',
  OPTION_NOT_FOUND = 'Unknown option "{0}"',
  OPTION_WRONG_VALUE = 'Wrong value for option "{0}". Expected <{1}> but found "{2}"',
  OPTION_MISSING_VALUE = 'Missing value of type <{0}> for option "{1}"',
  OPTION_REQUIRED = 'Missing required option "{0}"'
}

/** Utility class to format and identify error messages */
export class CliError {
  /** Format a given error type with the supplied arguments */
  static format(error: ErrorType, ...args: string[]) {
    return args.reduce(
      (acc, value: string, index: number) => acc.replace(new RegExp(`\\{${index}\\}`, "g"), value),
      error
    );
  }
  /** Test if the given error message matches an error type */
  private static test(value: string, error: ErrorType) {
    return new RegExp(error.replace(/\{\d\}/g, "[a-zA-Z-]+")).test(value);
  }
  /** Analize the given error message to identify its type */
  static analize(value: string | undefined) {
    return value && Object.values(ErrorType).find((type) => this.test(value, type));
  }
}
