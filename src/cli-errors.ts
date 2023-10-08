import Cli from ".";

/** Error messages for each error type */
export const ERROR_MESSAGES = {
  command_not_found: 'Command "{command}" not found',
  option_not_found: 'Unknown option "{option}"',
  option_wrong_value: 'Wrong value for option "{option}". Expected <{expected}> but found "{found}"',
  option_missing_value: 'Missing value of type <{type}> for option "{option}"',
  option_required: 'Missing required option "{option}"',
} as const;

/** Existing errors */
export type ErrorType = keyof typeof ERROR_MESSAGES;

/** Utility class to identify error messages */
export class CliError {
  /** Test if the given error message matches an error type */
  private static test(value: string, error: string) {
    return new RegExp(error.replace(/\{\w+\}/g, "[a-zA-Z-0-9/\\.]+")).test(value);
  }
  /** Analize the given error message to identify its type */
  static analize(value: string | undefined): ErrorType | undefined {
    if (!value) {
      return undefined;
    }
    return Object.entries(Cli.messages).find(([_, message]) => this.test(value, message))?.[0] as ErrorType;
  }
}
