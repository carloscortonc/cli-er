/** Existing errors */
export enum ErrorType {
  COMMAND_NOT_FOUND = "command_not_found",
  OPTION_NOT_FOUND = "option_not_found",
  OPTION_WRONG_VALUE = "option_wrong_value",
  OPTION_MISSING_VALUE = "option_missing_value",
  OPTION_REQUIRED = "option_required",
}

/** Error messages for each error type */
const ERROR_MESSAGES: { [key in ErrorType]: string } = {
  [ErrorType.COMMAND_NOT_FOUND]: 'Command "{0}" not found. Did you mean "{1}" ?',
  [ErrorType.OPTION_NOT_FOUND]: 'Unknown option "{0}"',
  [ErrorType.OPTION_WRONG_VALUE]: 'Wrong value for option "{0}". Expected <{1}> but found "{2}"',
  [ErrorType.OPTION_MISSING_VALUE]: 'Missing value of type <{0}> for option "{1}"',
  [ErrorType.OPTION_REQUIRED]: 'Missing required option "{0}"',
};

/** Utility class to format and identify error messages */
export class CliError {
  /** Format a given error type with the supplied arguments */
  static format(error: `${ErrorType}`, ...args: string[]) {
    return args.reduce(
      (acc, value: string, index: number) => acc.replace(new RegExp(`\\{${index}\\}`, "g"), value),
      ERROR_MESSAGES[error],
    );
  }
  /** Test if the given error message matches an error type */
  private static test(value: string, error: string) {
    return new RegExp(error.replace(/\{\d\}/g, "[a-zA-Z-0-9/\\.]+")).test(value);
  }
  /** Analize the given error message to identify its type */
  static analize(value: string | undefined): ErrorType | undefined {
    if (!value) {
      return undefined;
    }
    return Object.entries(ERROR_MESSAGES).find(([_, message]) => this.test(value, message))?.[0] as ErrorType;
  }
}
