import { CliError, ErrorType } from "./cli-errors";
import { Kind, OptionValue, Type, Option } from "./types";

type ValueParserOutput = { value: any; next: number; error?: string };

/** Evaluate the value of an option */
export default function parseOptionValue(
  value: string | undefined,
  current: OptionValue,
  option: Option
): ValueParserOutput {
  const type = option.type as Type;
  const defaultParserOutput = {
    /* Calculated value */
    value: undefined,
    /* Where to continue after processing current option-value */
    next: value !== undefined ? 1 : 0,
    /* Error found, if any */
    error:
      value === undefined && option.kind === Kind.OPTION
        ? CliError.format(ErrorType.OPTION_MISSING_VALUE, type, option.key!)
        : undefined,
  };
  const wrongValueError = CliError.format(ErrorType.OPTION_WRONG_VALUE, option.key!, type, value!);

  /** Implemented parsers */
  const valueParsers: { [key in Type]: Partial<ValueParserOutput> | (() => Partial<ValueParserOutput>) } = {
    [Type.STRING]: {
      value,
    },
    [Type.BOOLEAN]: () => ({
      value: ["true", undefined].includes(value),
      next: ["true", "false"].includes(value as string) ? 1 : 0,
      error: undefined,
    }),
    [Type.LIST]: () => ({
      value: ((current as string[]) || []).concat(value?.split(",") as string[]),
    }),
    [Type.NUMBER]: () => {
      const v = parseInt(value as string);
      return {
        value: v,
        error: value && isNaN(v) ? wrongValueError : defaultParserOutput.error,
      };
    },
    [Type.FLOAT]: () => {
      const v = parseFloat(value as string);
      return {
        value: v,
        error: value && isNaN(v) ? wrongValueError : defaultParserOutput.error,
      };
    },
  };

  const currentTypeParser = valueParsers[type];
  const parserOutput = typeof currentTypeParser === "function" ? currentTypeParser() : currentTypeParser;
  return { ...defaultParserOutput, ...parserOutput };
}
