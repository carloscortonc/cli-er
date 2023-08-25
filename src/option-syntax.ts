import { DefinitionElement, isShortAlias } from "./cli-utils";
import { Definition, Kind, Type } from "./types";

type ArgumentProcessor = (args: string[], definition: Definition<DefinitionElement>) => string[];

/** Process the supported option-value declarations syntax. Currently:
 * - {long-alias}={value}
 * - {short-alias}{value}
 */
const equalsSymbolProcessor: ArgumentProcessor = (args, definition) => {
  const aliases = Object.values(definition).reduce((acc, curr) => acc.concat(curr.aliases!), [] as string[]);
  const aliasWithValueRegexp = (a: string) => new RegExp(`^(?<alias>${a})${!isShortAlias(a) ? "=" : ""}(?<value>.+)`);
  return args.reduce((acc, curr) => {
    const aliasWithValue = aliases.find((a) => aliasWithValueRegexp(a).test(curr));
    if (aliasWithValue) {
      const { alias, value } = aliasWithValueRegexp(aliasWithValue).exec(curr)?.groups!;
      return acc.concat([alias, value]);
    }
    return acc.concat([curr]);
  }, [] as string[]);
};

/** Process multiple grouped boolean short-aliases, e.g. "-abc" */
const flagsProcessor: ArgumentProcessor = (args, definition) => {
  const flagOptions = Object.values(definition).reduce((acc, e) => {
    let shortAliases;
    if (
      e.kind === Kind.OPTION &&
      e.type === Type.BOOLEAN &&
      (shortAliases = e.aliases?.filter(isShortAlias))?.length! > 0
    ) {
      return acc.concat(shortAliases!.map((a) => a.replace(/^-/, "")));
    }
    return acc;
  }, [] as string[]);
  const multipleShortFlagsRegexp = new RegExp(`^-(?<flags>[${flagOptions.join("")}]+)$`);
  return args.reduce((acc, curr) => {
    const multipleFlags = multipleShortFlagsRegexp.test(curr);
    if (multipleFlags) {
      const { flags } = multipleShortFlagsRegexp.exec(curr)?.groups!;
      return acc.concat((flags as string).split("").map((f) => "-".concat(f)));
    }
    return acc.concat([curr]);
  }, [] as string[]);
};

/** Apply supported syntaxis to generate the final flatten list of arguments */
const flattenArguments: ArgumentProcessor = (args, definition) => {
  return [flagsProcessor, equalsSymbolProcessor].reduce((acc, processor) => processor(acc, definition), args);
};

export default flattenArguments;
