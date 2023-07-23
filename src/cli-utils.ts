import path from "path";
import fs from "fs";
import url from "url";
import { closest } from "fastest-levenshtein";
import { ColumnFormatter, debug, deprecationWarning, logErrorAndExit } from "./utils";
import { Kind, ParsingOutput, Definition, Type, CliOptions, Option, Namespace, Command } from "./types";
import { CliError, ErrorType } from "./cli-errors";
import parseOptionValue from "./cli-option-parser";
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
  if ([Kind.NAMESPACE, Kind.COMMAND].includes(element.kind as Kind)) {
    return [key];
  } else if (!element.aliases) {
    return [`--${key}`];
  }
  return element.aliases;
}

/** Process definition and complete any missing fields */
export function completeDefinition(definition: Definition<DefinitionElement>, cliOptions: CliOptions) {
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
  // Print CliOptions deprecations
  deprecationWarning({
    condition: cliOptions.onFail !== undefined,
    property: "CliOptions.onFail.*",
    version: "0.11.0",
  });
  for (const element in definition) {
    completeElementDefinition(element, definition[element]);
  }
  return definition;
}

/** Calculate if the provided element is a command  */
const isCommand = (element: DefinitionElement) =>
  element.kind === Kind.COMMAND ||
  typeof element.action === "function" ||
  (element.options !== undefined && !Object.values(element.options).some(isCommand));

function completeElementDefinition(name: string, element: DefinitionElement) {
  // Infer kind when not specified
  if (!element.kind) {
    element.kind = Object.values(element.options || {}).some(isCommand)
      ? Kind.NAMESPACE
      : isCommand(element)
      ? Kind.COMMAND
      : Kind.OPTION;
  }
  // Complete aliases
  element.aliases = getAliases(name, element);
  // Set option type to string if missing
  if (element.kind === Kind.OPTION && !element.type) {
    element.type = Type.STRING;
  }
  // Add name as key
  element.key = name;
  // Print deprecations
  deprecationWarning({
    condition: typeof element.value === "function",
    property: "Option.value",
  });
  for (const optionKey in element.options ?? {}) {
    completeElementDefinition(optionKey, element.options![optionKey]);
  }
}

/** Process incoming args based on provided definition */
export function parseArguments(
  args: string[],
  definition: Definition<DefinitionElement>,
  cliOptions: CliOptions,
): ParsingOutput {
  const output: ParsingOutput = {
    location: [],
    options: {},
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
    if (element.kind !== Kind.COMMAND || element.type !== undefined) {
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
      output.options._ = args.slice(argIndex + 1);
      argsToProcess = argsToProcess.slice(0, argIndex - 1);
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
        if (!optsAliases.includes(arg)) {
          const suggestion = closestSuggestion(arg, definition, output.location, cliOptions);
          output.errors.push(CliError.format(ErrorType.COMMAND_NOT_FOUND, arg, suggestion));
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

  // Process args
  for (let i = 0; i < argsToProcess.length; i++) {
    const curr = argsToProcess[i],
      next = argsToProcess[i + 1];
    const optionKey = typeof aliases[curr] === "string" ? (aliases[curr] as string) : curr;
    const optionDefinition = aliases[optionKey] as DefinitionElement;
    const outputKey = optionDefinition && (optionDefinition.key as string);
    if (aliases.hasOwnProperty(optionKey)) {
      const evaluatedValue = aliases.hasOwnProperty(next) ? undefined : next;
      const parser = typeof optionDefinition.parser === "function" ? optionDefinition.parser : parseOptionValue;
      const parserOutput = parser({
        value: evaluatedValue,
        current: output.options[outputKey],
        option: {
          ...(optionDefinition as Option),
          key: curr,
        },
        format: CliError.format,
      });
      if (parserOutput.error) {
        output.errors.push(parserOutput.error);
      } else {
        output.options[outputKey] = parserOutput.value;
      }
      i += parserOutput.next !== undefined ? parserOutput.next : evaluatedValue !== undefined ? 1 : 0;
    } else if (!aliases.hasOwnProperty(optionKey)) {
      // Unknown option
      output.errors.push(CliError.format(ErrorType.OPTION_NOT_FOUND, curr));
    }
  }

  // Verify required options
  Object.values(defToProcess).some((opt) => {
    if (opt.required && output.options[opt.key!] === undefined) {
      output.errors.push(CliError.format(ErrorType.OPTION_REQUIRED, opt.key!));
      return true;
    }
  });

  // Process value-transformations. Remove in 0.11.0 in favor of Option.parser
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
  const base = cliOptions.baseScriptLocation;
  if (!base) {
    return logErrorAndExit(Cli.formatMessage("execute.base-location-error"));
  }
  const entryFile = path.parse(getEntryFile());

  const finalLocation = [
    // Apply CliOptions.commandsPath configuration for single commands
    ...(location.length === 1 && cliOptions.commandsPath !== "." ? [cliOptions.commandsPath] : []),
    // Include CliOptions.rootCommand if empty location provided
    ...(location.length === 0 && typeof cliOptions.rootCommand === "string" ? [cliOptions.rootCommand] : []),
  ].concat(location);

  const scriptPaths = [".", ...finalLocation]
    .reduce((acc: { path: string; default: boolean }[], _, i: number, list) => {
      // Reverse index to consider the most specific paths first
      const index = list.length - 1 - i;
      const isDefaultImport = index === list.length - 1;
      const locationPaths = [];
      // Include index import
      locationPaths.push(path.join(...location.slice(0, index), "index"));
      if (index > 0) {
        // Include location-name import
        locationPaths.push(path.join(...location.slice(0, index)));
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

  const validScriptPath = scriptPaths.find((p) => fs.existsSync(p.path));

  if (!validScriptPath) {
    debug(
      scriptPaths.reduce(
        (acc, sp) => "".concat(acc, "  ", sp.path, "\n"),
        "There was a problem finding the script to run. Considered paths were:\n",
      ),
    );
    return logErrorAndExit();
  }

  try {
    let m;
    // Use "require" for cjs
    if (isCjs()) {
      m = require(validScriptPath.path);
    } else {
      m = await import(url.pathToFileURL(validScriptPath.path).href).then((_m) =>
        validScriptPath.default ? _m.default : _m,
      );
    }
    const fn = validScriptPath.default ? m : m[location[location.length - 1]];
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
  const { existingKinds, hasOptions } = Object.values(definitionRef || {}).reduce(
    (acc, curr) => {
      if (curr.kind === Kind.OPTION) {
        acc.hasOptions = true;
      } else if (acc.existingKinds.indexOf(curr.kind as string) < 0) {
        acc.existingKinds.push(curr.kind as string);
      }
      return acc;
    },
    { existingKinds: [] as string[], hasOptions: false },
  );

  const formatKinds = (kinds: string[]) =>
    ` ${kinds
      .sort((a) => (a === Kind.NAMESPACE ? -1 : 1))
      .join("|")
      .toUpperCase()}`;

  sections[HELP_SECTIONS.USAGE] = [
    `${Cli.formatMessage("generate-help.usage")}:  ${cliOptions.cliName}`,
    location.length > 0 ? ` ${location.join(" ")}` : "",
    existingKinds.length > 0 ? formatKinds(existingKinds) : "",
    element?.kind === Kind.COMMAND && element!.type !== undefined ? ` <${element!.type}>` : "",
    hasOptions ? " ".concat(Cli.formatMessage("generate-help.has-options")) : "",
    "\n",
  ].join("");
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
  const defaultHint = (option: DefinitionElement) =>
    option.default !== undefined
      ? " ".concat(Cli.formatMessage("generate-help.option-default", { default: option.default.toString() }))
      : "";
  // Format all the information relative to an element
  const formatElement = (element: ExtendedDefinitionElement, formatter: ColumnFormatter, indentation: number) =>
    [
      " ".repeat(indentation),
      formatter.format("name", element.name, 2),
      element.description || "-",
      defaultHint(element),
      "\n",
    ].join("");

  // Initialize element-sections
  const elementSectionsTemplate: ElementSections = {
    [HELP_SECTIONS.NAMESPACES]: [],
    [HELP_SECTIONS.COMMANDS]: [],
    [HELP_SECTIONS.OPTIONS]: [],
  };

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
          };
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
      const sectionTitle = Cli.formatMessage(`generate-help.${sectionKey}-title`);
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
    const regexp = new RegExp(`${templateKey(sectionKey)}${sectionContent ? "" : "\n*"}`);
    return acc.replace(regexp, sectionContent || "");
  }, cliOptions.help.template);
  Cli.logger.log(formattedHelp);
}

/** Get the scoped definition element for the given location */
export function getDefinitionElement(
  definition: Definition<DefinitionElement>,
  rawLocation: string[],
  cliOptions: CliOptions,
): DefinitionElement | undefined {
  let definitionRef = definition;
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
  Cli.logger.log(`${" ".repeat(2)}${cliOptions.cliName} version: ${cliOptions.cliVersion}\n`);
}

/** Find the closest namespace/command based on the given target and location */
export function closestSuggestion(
  target: string,
  definition: Definition<DefinitionElement>,
  rawLocation: string[],
  cliOptions: CliOptions,
) {
  let def = definition;
  if (rawLocation.length > 0) {
    def = getDefinitionElement(definition, rawLocation, cliOptions)!.options!;
  }
  const candidates = Object.values(def || {})
    .filter((e) => e.kind !== Kind.OPTION)
    .reduce((acc: string[], curr) => [...acc, ...curr.aliases!], []);
  return closest(target, candidates);
}
