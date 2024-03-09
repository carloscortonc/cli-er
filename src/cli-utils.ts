import path from "path";
import fs from "fs";
import url from "url";
import {
  addLineBreaks,
  clone,
  ColumnFormatter,
  debug,
  DEBUG_TYPE,
  deprecationWarning,
  logErrorAndExit,
  quote,
} from "./utils";
import { Kind, ParsingOutput, Definition, Type, CliOptions, Option, Namespace, Command } from "./types";
import parseOptionValue from "./cli-option-parser";
import { validatePositional } from "./definition-validations";
import flattenArguments from "./option-syntax";
import { closest } from "./edit-distance";
import { generateCompletions } from "./bash-completion";
import Cli from ".";

/** Create a type containing all elements for better readability, as here is not necessary type-checking due to all methods being internal */
type F<T> = Omit<T, "kind" | "options">;
export type OptionExt = Option & { key?: string };
export type DefinitionElement = F<Namespace> &
  F<Command> &
  F<OptionExt> & {
    kind?: `${Kind}`;
    options?: Definition<DefinitionElement>;
  };
type CompletionContext = {
  positional: Option[];
  location: string[];
};

/** Check whether the program using this library is running in cjs */
const isCjs = () => require.main !== undefined;

/** Get the file location of the main cli application */
export function getEntryFile() {
  return fs.realpathSync(isCjs() ? require.main!.filename : process.argv[1]);
}

/** Get the directory of the main cli application */
export function getEntryPoint() {
  return path.dirname(getEntryFile());
}

/** Determine the correct aliases depending on the kind of element */
function getAliases(key: string, element: DefinitionElement) {
  if (element.kind === Kind.NAMESPACE || !element.aliases) {
    return [key];
  }
  if (element.kind === Kind.COMMAND) {
    return [key].concat(element.aliases);
  }
  return element.aliases.map((alias) => {
    if (!alias.startsWith("-")) {
      return (alias.length > 1 ? "--" : "-").concat(alias);
    }
    deprecationWarning({
      property: "Option.aliases with dashes",
      description: "Aliases should be specified without dashes",
    });
    return alias;
  });
}

/** Check if a given alias is considered short alias */
export const isShortAlias = (alias: string) => /^-\w$/.test(alias);

/** Process definition and complete any missing fields */
export function completeDefinition(definition: Definition<DefinitionElement>, cliOptions: CliOptions) {
  // Include completion command
  if (cliOptions.completion.enabled) {
    definition[cliOptions.completion.command] = {
      action: () => generateCompletions({ definition, cliOptions }),
      hidden: true,
    };
  }
  const { autoInclude: helpAutoInclude, template: _, ...helpOption } = cliOptions.help;
  // Auto-include help option
  if (helpAutoInclude) {
    definition.help = helpOption;
  }
  const { autoInclude: versionAutoInclude, ...versionOption } = cliOptions.version;
  // Auto-include version option
  if (versionAutoInclude) {
    definition.version = versionOption;
  }
  const context = { positional: [], location: [] };
  for (const element in definition) {
    completeElementDefinition(element, definition, context);
  }
  // validate positional arguments for current definition
  validatePositional(context.positional);
  return definition;
}

/** Calculate if the provided element is a command  */
const isCommand = (element: DefinitionElement) =>
  element.kind === Kind.COMMAND ||
  typeof element.action === "function" ||
  (element.options !== undefined && !Object.values(element.options).some(isCommand));

function completeElementDefinition(
  name: string,
  definition: Definition<DefinitionElement>,
  context: CompletionContext,
) {
  const element = definition[name];
  // Infer kind when not specified
  if (!element.kind) {
    element.kind = Object.values(element.options || {}).some(isCommand)
      ? Kind.NAMESPACE
      : isCommand(element)
      ? Kind.COMMAND
      : Kind.OPTION;
  }

  if (element.kind === Kind.OPTION) {
    // Set positional arguments configured as "true" with type=list
    if (element.positional === true) {
      element.type = Type.LIST;
    }
    // Set option type to string if missing
    else if (!element.type) {
      element.type = Type.STRING;
    }
    // Update validation context
    ![undefined, false].includes(element.positional as any) && context.positional.push(element as Option);

    // Initialize aliases before negated-boolean processing
    element.aliases = element.aliases || [name];

    // Include negated version for boolean options
    if (
      element.type === Type.BOOLEAN &&
      element.negatable === true &&
      element.aliases?.some((a) => !a.startsWith("-") && a.length > 1)
    ) {
      definition[name.concat("Negated")] = {
        kind: Kind.OPTION,
        type: Type.BOOLEAN,
        // Will only work when aliases are defined without dashes
        aliases: element.aliases
          .filter((a) => !a.startsWith("-") && a.length > 1)
          .reduce((acc, a) => [...acc, ...["no", "no-"].map((e) => `--${e}`.concat(a))], [] as string[]),
        parser: (input) => {
          const o = parseOptionValue(input);
          return { ...o, value: !o.value };
        },
        hidden: true,
        key: name,
      };
    } else if (element.type === Type.BOOLEAN && element.negatable === true) {
      debug(
        DEBUG_TYPE.WARN,
        `Boolean option <${name}> will be included without negated aliases.` +
          " To change this, provide long aliases without dashes",
      );
    }
  }
  // Complete aliases
  element.aliases = getAliases(name, element);
  // Add name as key
  element.key = name;
  // Look for description inside `messages`, otherwise use element's description
  const descriptionIntlPrefix = context.location.length > 0 ? context.location.join(".").concat(".") : "";
  element.description =
    Cli.formatMessage(descriptionIntlPrefix.concat(name, ".description") as any, {}) || element.description;
  // Print deprecations
  deprecationWarning({
    property: "Command.type",
    condition: element.kind === Kind.COMMAND && element.type !== undefined,
    description: "Create inside a new option with `positional: 0` instead",
  });
  deprecationWarning({
    property: "Option.value",
    condition: typeof element.value === "function",
    version: "0.12.0",
    alternative: "Option.parser",
  });
  const deContext = { ...context, positional: [] };
  for (const optionKey in element.options ?? {}) {
    completeElementDefinition(
      optionKey,
      element.options!,
      Object.assign(deContext, { location: context.location.concat(name) }),
    );
  }
  // validate positional arguments for nested options
  validatePositional(deContext.positional);
}

/** Process incoming args based on provided definition */
export function parseArguments(
  args: string[],
  definition: Definition<DefinitionElement>,
  cliOptions: CliOptions,
): ParsingOutput {
  const output: ParsingOutput = {
    location: [],
    options: { _: [] },
    errors: [],
  };
  const aliases: { [key: string]: DefinitionElement | string } = {};
  let argsToProcess = args;

  const processElement = (element: DefinitionElement) => {
    // Do not include namespaces in aliases, as they will never have any value associated
    if (element.kind === Kind.NAMESPACE) {
      return;
    }
    const [mainAlias, ...otherAliases] = element.aliases!;
    aliases[mainAlias] = element;
    // The remaining aliases will point to the name of the main alias
    otherAliases.forEach((alias: string) => {
      aliases[alias] = mainAlias;
    });
    //Process default
    if (element.type !== undefined && element.default !== undefined) {
      output.options[element.key!] = element.default;
    }
  };

  let definitionRef = definition,
    commandFound = false;
  const optsAliases = [];
  argsLoop: for (let argIndex = 0; argIndex < args.length; argIndex++) {
    const arg = args[argIndex];
    // Detect "--" delimiter to stop parsing
    if (arg === "--") {
      output.options.__ = args.slice(argIndex + 1);
      const argsRemoved = args.length - argsToProcess.length;
      argsToProcess = argsToProcess.slice(0, argIndex - (argsRemoved - 1) - 1);
      break argsLoop;
    } else if (commandFound) {
      continue;
    }
    // Sort definition to process options first
    const entries = Object.entries(definitionRef ?? {}).sort(([_, a]) => (a.kind === Kind.OPTION ? -1 : 1));
    for (let i = 0; i < entries.length; i++) {
      const [key, element]: [string, DefinitionElement] = entries[i];
      if (element.kind === Kind.OPTION) {
        optsAliases.push(...element.aliases!);
        continue;
      }
      if (!element.aliases?.includes(arg)) {
        if (i < entries.length - 1) {
          continue;
        }
        // Only generate error when no root-command is registered
        if (!optsAliases.includes(arg) && (!cliOptions.rootCommand || output.location.length > 0)) {
          const suggestion = closestSuggestion({
            target: arg,
            kind: [Kind.NAMESPACE, Kind.COMMAND],
            definition,
            rawLocation: output.location,
            cliOptions,
          })!;
          const msg = "".concat(
            Cli.formatMessage("command_not_found", { command: arg }),
            Cli.formatMessage("parse-arguments.suggestion", { suggestion }),
          );
          output.errors.push(msg);
        }
        break argsLoop;
      }
      if (element.kind === Kind.COMMAND) {
        if (element.type === undefined) {
          argsToProcess = argsToProcess.slice(1);
        }
        output.location.push(key);
        commandFound = true;
        break;
      }
      // Namespaces will follow here
      argsToProcess = argsToProcess.slice(1);
      output.location.push(key);
      definitionRef = definitionRef[key].options || {};
      break;
    }
  }
  const elLocation =
    output.location.length === 0 && typeof cliOptions.rootCommand === "string"
      ? [cliOptions.rootCommand]
      : output.location;
  const defElement = getDefinitionElement(definition, elLocation, cliOptions)!;
  // Process all element aliases and defaults
  const defToProcess = elLocation.length > 0 ? { "": defElement, ...defElement.options } : definition;
  Object.values(defToProcess).forEach(processElement);
  // Generate a map containing the positional-options
  const positionalOptions = Object.values(defToProcess).reduce(
    (acc: { [k: string]: DefinitionElement }, { positional, kind, ...opt }) => {
      if (kind === Kind.OPTION && (positional === true || typeof positional === "number")) {
        acc[positional.toString()] = opt;
      }
      return acc;
    },
    {},
  );
  // prettier-ignore
  enum Positional { TRUE = "1", FALSE = "0" }
  // Flag to ignore all positional options if the first one is misplaced (missing)
  let ignorePositional = false;

  const finalArgs = flattenArguments(argsToProcess, defToProcess);

  // Process args
  for (let i = 0; i < finalArgs.length; i++) {
    const curr = finalArgs[i],
      next = finalArgs[i + 1];
    const optionKey = typeof aliases[curr] === "string" ? (aliases[curr] as string) : curr;
    const strictPositional = positionalOptions[i];
    // If an option-alias is found where a numeric-positional option was expected, discard all remaining numeric-positional options
    ignorePositional ||= strictPositional && aliases.hasOwnProperty(optionKey);
    const positional = (!ignorePositional ? strictPositional : undefined) || positionalOptions.true;
    const [optionDefinition, isPositional] = aliases.hasOwnProperty(optionKey)
      ? [aliases[optionKey] as DefinitionElement, Positional.FALSE]
      : [positional, !!positional ? Positional.TRUE : Positional.FALSE];
    if (optionDefinition !== undefined) {
      const outputKey = optionDefinition.key!;
      // Mapping between whether a positional-option applies, and the value to be used in parsing
      const posMapping: { [k: string]: string } = { [Positional.FALSE]: next, [Positional.TRUE]: curr };
      const evaluatedValue = Object.entries(posMapping).some(
        ([pString, v]) => pString === isPositional && aliases.hasOwnProperty(v),
      )
        ? undefined
        : posMapping[isPositional];
      const parser = typeof optionDefinition.parser === "function" ? optionDefinition.parser : parseOptionValue;
      const parserOutput = parser({
        value: evaluatedValue,
        current: output.options[outputKey],
        option: {
          ...(optionDefinition as Option),
          key: isPositional === Positional.TRUE ? optionDefinition.key! : curr,
        },
        format: () =>
          deprecationWarning({
            property: "Option.parser::format",
            alternative: "Cli.formatMessage",
          }),
      });
      if (parserOutput.error) {
        output.errors.push(parserOutput.error);
      } else {
        output.options[outputKey] = parserOutput.value;
      }
      i += parserOutput.next !== undefined ? parserOutput.next : evaluatedValue !== undefined ? 1 : 0;
      // Adjust for positional options
      i -= isPositional === Positional.TRUE ? 1 : 0;
    } else {
      // Include unknown arg inside "_" key, and add an error
      output.options._.push(curr);
      const suggestion = closestSuggestion({
        target: curr,
        kind: [Kind.OPTION],
        rawLocation: output.location,
        definition,
        cliOptions,
        maxDistance: 3,
      });
      const msg = "".concat(
        Cli.formatMessage("option_not_found", { option: curr }),
        suggestion ? Cli.formatMessage("parse-arguments.suggestion", { suggestion }) : "",
      );
      output.errors.push(msg);
    }
  }

  // Verify required options
  Object.values(defToProcess).some((opt) => {
    if (opt.required && output.options[opt.key!] === undefined) {
      output.errors.push(Cli.formatMessage("option_required", { option: opt.key! }));
      return true;
    }
  });

  // Process value-transformations. Removed in 0.11.0 in favor of Option.parser
  Object.values(aliases)
    .filter((v) => typeof v !== "string" && typeof v.value === "function")
    .forEach((v) => {
      const k = (v as OptionExt).key!;
      output.options[k] = (v as Option).value!(output.options[k], { ...output.options });
    });

  return output;
}

/** Given the processed options, determine the script location and invoke it with the processed options */
export async function executeScript({ location, options }: Omit<ParsingOutput, "errors">, cliOptions: CliOptions) {
  const base = cliOptions.baseLocation;
  if (!base) {
    return logErrorAndExit(Cli.formatMessage("execute.base-location-error"));
  }
  const entryFile = path.parse(getEntryFile());

  const finalLocation = location.length === 1 ? [cliOptions.commandsPath].concat(location) : location;

  debug(DEBUG_TYPE.TRACE, `[run:executeScript] Parameters: ${JSON.stringify({ location: finalLocation, options })}`);

  const scriptPaths = [".", ...finalLocation]
    .reduce((acc: { path: string; default: boolean }[], _, i: number, list) => {
      // Reverse index to consider the most specific paths first
      const index = list.length - 1 - i;
      const isDefaultImport = index === list.length - 1;
      const locationPaths = [];
      // Include index import
      locationPaths.push(path.join(...finalLocation.slice(0, index), "index"));
      if (index > 0) {
        // Include location-name import
        locationPaths.push(path.join(...finalLocation.slice(0, index)));
      } else {
        // Include entryfile-name import
        locationPaths.push(entryFile.name);
      }
      locationPaths.forEach((lp) => {
        acc.push({ path: lp, default: isDefaultImport });
      });
      return acc;
    }, [])
    .map((p) => ({ ...p, path: path.join(base, p.path.concat(entryFile.ext)) }));

  debug(DEBUG_TYPE.TRACE, `[run:executeScript] List of candidates: ${JSON.stringify(scriptPaths)}`);

  const validScriptPath = scriptPaths.find((p) => fs.existsSync(p.path));

  if (!validScriptPath) {
    debug(
      DEBUG_TYPE.WARN,
      scriptPaths.reduce(
        (acc, sp) => "".concat(acc, "  ", sp.path, "\n"),
        "There was a problem finding the script to run. Considered paths were:\n",
      ),
    );
    return logErrorAndExit();
  }

  debug(DEBUG_TYPE.TRACE, `[run:executeScript] Selected candidate: ${JSON.stringify(validScriptPath)}`);

  try {
    let m;
    // Use "require" for cjs
    if (isCjs()) {
      m = require(validScriptPath.path);
    } else {
      m = await import(url.pathToFileURL(validScriptPath.path).href);
    }
    const fn = validScriptPath.default ? m.default || m : m[location[location.length - 1]];
    if (typeof fn !== "function") {
      logErrorAndExit(Cli.formatMessage("execute.handler-not-found", { path: validScriptPath.path }));
    }
    return fn(options);
  } catch (e: any) {
    logErrorAndExit(Cli.formatMessage("execute.execution-error", { path: validScriptPath.path, error: e.message }));
  }
}

enum HELP_SECTIONS {
  USAGE = "usage",
  DESCRIPTION = "description",
  NAMESPACES = "namespaces",
  COMMANDS = "commands",
  OPTIONS = "options",
}

export function generateScopedHelp(
  definition: Definition<DefinitionElement>,
  rawLocation: string[],
  cliOptions: CliOptions,
) {
  let location = rawLocation;
  const element = getDefinitionElement(definition, location, cliOptions);
  let definitionRef = definition;
  const sections: { [key in HELP_SECTIONS]?: string } = {};
  if (location.length > 0) {
    if (element && [Kind.NAMESPACE, Kind.COMMAND].includes(element.kind as Kind)) {
      sections[HELP_SECTIONS.DESCRIPTION] = element.description?.concat("\n");
      definitionRef = element.options as Definition<DefinitionElement>;
    } else {
      // Some element in location was incorrect. Output the entire help
      Cli.logger.log(`\n${Cli.formatMessage("generate-help.scope-not-found", { scope: location.join(" > ") })}\n`);
      location = [];
    }
  } else if (cliOptions.cliDescription) {
    sections[HELP_SECTIONS.DESCRIPTION] = cliOptions.cliDescription.concat("\n");
  }
  // Add usage section
  const { existingKinds, hasOptions, positionalOptions } = Object.values(definitionRef || {})
    .filter((e) => !e.hidden)
    .reduce(
      (acc, curr) => {
        const { kind, positional, required, key } = curr;
        if (kind === Kind.OPTION) {
          acc.hasOptions = true;
          if (positional === true || typeof positional === "number") {
            acc.positionalOptions.push({ index: positional, key, required });
          }
        } else if (acc.existingKinds.indexOf(kind as string) < 0) {
          acc.existingKinds.push(kind as string);
        }
        return acc;
      },
      { existingKinds: [] as string[], hasOptions: false, positionalOptions: [] as any[] },
    );

  const formatKinds = (kinds: string[]) =>
    kinds
      .sort((a) => (a === Kind.NAMESPACE ? -1 : 1))
      .join("|")
      .toUpperCase();

  const formatPositionalOptions = (positionalOpts: any[]) =>
    positionalOpts
      .sort((a, b) => (b.index === true ? -1 : a.index === true ? 1 : a.index - b.index))
      .map(({ index, key, required }) => {
        const s = index === true ? "..." : "";
        return required ? `<${key}${s}>` : `[${key}${s}]`;
      })
      .join(" ");

  sections[HELP_SECTIONS.USAGE] = [
    `${Cli.formatMessage("generate-help.usage")}:  ${cliOptions.cliName}`,
    location.join(" "),
    formatKinds(existingKinds),
    element?.kind === Kind.COMMAND && element!.type !== undefined ? `<${element!.type}>` : "",
    formatPositionalOptions(positionalOptions),
    hasOptions ? Cli.formatMessage("generate-help.has-options") : "",
  ]
    .filter((e) => e)
    .join(" ")
    .concat("\n");
  generateHelp(definitionRef, cliOptions, sections);
}

/** Print the resulting documentation of formatting the given definition */
function generateHelp(
  definition: Definition<DefinitionElement> = {},
  cliOptions: CliOptions,
  sections: { [key in HELP_SECTIONS]?: string } = {},
) {
  const formatter = new ColumnFormatter();
  const sectionIndentation = 2;

  type ExtendedDefinitionElement = DefinitionElement & { name: string };
  type ElementSections = { [key in HELP_SECTIONS]?: ExtendedDefinitionElement[] };

  // Generate the formatted versions of aliases
  const formatAliases = (aliases: string[] = []) => aliases.join(", ");
  // Generate default-value hint, if present
  const defaultHint = (option: DefinitionElement) => {
    const w = (c: string) => (c ? ` (${c})` : c);
    // format default/enum value
    const f = (v: any) => {
      if (typeof v !== "string" && !Array.isArray(v)) {
        return v;
      }
      const isNumber = ["number", "float"].includes(option.type!);
      return (Array.isArray(v) ? v : [v]).map((e) => (isNumber ? e : quote(e))).join(", ");
    };
    return w(
      [
        Array.isArray(option.enum) ? Cli.formatMessage("generate-help.option-enum", { enum: f(option.enum) }) : "",
        option.default !== undefined
          ? Cli.formatMessage("generate-help.option-default", { default: f(option.default) })
          : "",
      ]
        .filter((e) => e)
        .join(", "),
    );
  };
  // Format all the information relative to an element
  const formatElement = (element: ExtendedDefinitionElement, formatter: ColumnFormatter, indentation: number) => {
    const start = [" ".repeat(indentation), formatter.format("name", element.name, 2)].join("");
    return [
      start,
      addLineBreaks([element.description || "-", defaultHint(element)].join(""), { start: start.length }),
    ].join("");
  };

  // Initialize element-sections
  const elementSectionsTemplate = {
    [HELP_SECTIONS.NAMESPACES]: [],
    [HELP_SECTIONS.COMMANDS]: [],
    [HELP_SECTIONS.OPTIONS]: [],
  } as const;

  // Caculate all element-sections and process section values
  const { elementSections, formattedNames }: { elementSections: ElementSections; formattedNames: string[] } =
    Object.values(definition)
      .filter(({ hidden }) => hidden !== true)
      .reduce(
        (acc: any, element) => {
          const sectionAdapter: { [key in Kind]: HELP_SECTIONS } = {
            [Kind.NAMESPACE]: HELP_SECTIONS.NAMESPACES,
            [Kind.COMMAND]: HELP_SECTIONS.COMMANDS,
            [Kind.OPTION]: HELP_SECTIONS.OPTIONS,
          } as const;
          const sectionKey = sectionAdapter[element.kind as Kind],
            name = formatAliases(element.aliases);
          const completeElement = { ...element, name };
          acc.formattedNames.push(name);
          acc.elementSections[sectionKey].push(completeElement);
          return acc;
        },
        { elementSections: elementSectionsTemplate, formattedNames: [] },
      );

  // Process all names from namespaces, commands and options into formatter
  formatter.process("name", formattedNames);

  // Format all element-sections
  Object.entries(elementSections)
    .filter(([_, content]) => content.length > 0)
    .forEach(([sectionKey, content]) => {
      const sectionTitle = Cli.formatMessage(
        `generate-help.${sectionKey as keyof typeof elementSectionsTemplate}-title`,
      );
      let sectionContent = `${sectionTitle}:\n`;
      content.forEach((item: ExtendedDefinitionElement) => {
        sectionContent += formatElement(item, formatter, sectionIndentation);
      });
      sections[sectionKey as HELP_SECTIONS] = sectionContent;
    });
  // Assert all sections are initialized
  Object.values(HELP_SECTIONS).forEach((sectionKey) => {
    if (!sections[sectionKey]) {
      sections[sectionKey] = undefined;
    }
  });
  const templateKey = (key: string) => `{${key}}`;
  const formattedHelp = Object.entries(sections).reduce((acc, [sectionKey, sectionContent]) => {
    const regexp: RegExp = new RegExp(`${templateKey(sectionKey)}${sectionContent ? "" : "\n*"}`);
    return acc.replace(regexp, sectionContent || "");
  }, cliOptions.help.template!);
  Cli.logger.log(formattedHelp);
}

/** Get the scoped definition element for the given location */
export function getDefinitionElement(
  definition: Definition<DefinitionElement>,
  rawLocation: string[],
  cliOptions: CliOptions,
): DefinitionElement | undefined {
  let definitionRef = clone(definition);
  let inheritedOptions: Definition = {};
  const getOptions = (d: Definition<DefinitionElement>) =>
    Object.entries(d)
      .filter(([_, { kind }]) => kind === Kind.OPTION)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
  // Previous inherited options will be placed last
  const calculateGlobalOptions = (newOptions: Definition = {}) =>
    Object.entries(inheritedOptions)
      .filter(([k]) => !Object.keys(newOptions).includes(k))
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), newOptions);
  const location = rawLocation[0] === cliOptions.commandsPath ? rawLocation.slice(1) : rawLocation;
  for (let i = 0; i < location.length; i++) {
    const key = location[i];
    inheritedOptions = calculateGlobalOptions(getOptions(definitionRef));
    if (i === location.length - 1) {
      definitionRef = definitionRef[key] as Definition<DefinitionElement>;
      break;
    } else if (
      definitionRef.hasOwnProperty(key) &&
      [Kind.NAMESPACE, Kind.COMMAND].includes(definitionRef[key].kind as Kind)
    ) {
      definitionRef = definitionRef[key].options as Definition<DefinitionElement>;
    } else {
      return undefined;
    }
  }
  if (location.length > 0 && definitionRef) {
    definitionRef.options = calculateGlobalOptions(definitionRef.options as Definition);
  }
  return definitionRef;
}

/** Find and format the version of the application that is using this library */
export function formatVersion(cliOptions: CliOptions) {
  const { cliName, cliVersion } = cliOptions;
  Cli.logger.log(Cli.formatMessage("generate-version.template", { cliName, cliVersion }));
}

/** Find the closest namespace/command based on the given target and location */
export function closestSuggestion(params: {
  target: string;
  definition: Definition<DefinitionElement>;
  rawLocation: string[];
  cliOptions: CliOptions;
  kind: Kind[];
  maxDistance?: number;
}) {
  let def = params.definition;
  if (params.rawLocation.length > 0) {
    def = getDefinitionElement(params.definition, params.rawLocation, params.cliOptions)!.options!;
  }
  const candidates = Object.values(def || {})
    .filter((e) => params.kind.includes(e.kind as Kind))
    .reduce((acc: string[], curr) => [...acc, ...curr.aliases!], []);
  const { value, distance } = closest(params.target, candidates);
  return !params.maxDistance || distance <= params.maxDistance ? value : undefined;
}
