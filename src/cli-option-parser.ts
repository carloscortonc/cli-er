import { Kind, Type, ValueParserInput, ValueParserOutput } from "./types";
import Cli from ".";

/** Evaluate the value of an option */
export default function parseOptionValue({ value, current, option }: ValueParserInput): ValueParserOutput {
  const type = option.type as Type;
  const defaultParserOutput = {
    /* Calculated value */
    value: undefined,
    /* Where to continue after processing current option-value */
    next: undefined,
    /* Error found, if any */
    error:
      value === undefined && option.kind === Kind.OPTION
        ? Cli.formatMessage("option_missing_value", { type, option: option.key })
        : undefined,
  };
  const wrongValueError = Cli.formatMessage("option_wrong_value", {
    option: option.key,
    expected: `<${type}>`,
    found: value!,
  });
  // Validate Option.enum
  const validateEnum = (values: (string | undefined)[]) => {
    if (!option.enum) {
      return undefined;
    }
    const found = values.find((v) => !option.enum!.includes(v!));
    const formatEnum = () => option.enum!.join(" | ");
    return found
      ? Cli.formatMessage("option_wrong_value", { option: option.key, expected: `'${formatEnum()}'`, found })
      : undefined;
  };

  /** Implemented parsers */
  const valueParsers: { [key in Type]: Partial<ValueParserOutput> | (() => Partial<ValueParserOutput>) } = {
    [Type.STRING]: () => ({
      value,
      error: defaultParserOutput.error || validateEnum([value]),
    }),
    [Type.BOOLEAN]: () => ({
      value: ["true", undefined].includes(value),
      next: ["true", "false"].includes(value as string) ? 1 : 0,
      error: undefined,
    }),
    [Type.LIST]: () => {
      const v = ((current as string[]) || []).concat(value?.split(",") as string[]);
      return {
        value: v,
        error: defaultParserOutput.error || validateEnum(v),
      };
    },
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
