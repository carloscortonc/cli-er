import path from "path";
import fs from "fs";
import url from "url";
import { closest } from "fastest-levenshtein";
import { ColumnFormatter, logErrorAndExit } from "./utils";
import { Kind, ParsingOutput, Definition, Type, CliOptions, Option, Namespace, Command } from "./types";
import { CliError, ErrorType } from "./cli-errors";
import parseOptionValue from "./cli-option-parser";
import Cli from ".";

/** Create a type containing all elements for better readability, as here is not necessary type-checking due to all methods being internal */
type F<T> = Omit<T, "kind" | "options">;
export type DefinitionElement = F<Namespace> &
  F<Command> &
  F<Option> & {
    kind?: `${Kind}`;
    options?: Definition<DefinitionElement>;
  };

/** Get the file location of the main cli application */
export function getEntryFile() {
  return path.resolve(require.main?.filename || process.argv[1]);
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
  // Auto-include help option
  if (cliOptions.help.autoInclude) {
    definition.help = {
      type: "boolean",
      aliases: cliOptions.help.aliases,
      description: cliOptions.help.description,
    };
  }
  // Auto-include version option
  if (cliOptions.version.autoInclude) {
    definition.version = {
      type: "boolean",
      aliases: cliOptions.version.aliases,
      description: cliOptions.version.description,
      hidden: true,
    };
  }
  for (const element in definition) {
    completeElementDefinition(element, definition[element]);
  }
  return definition;
}

function completeElementDefinition(name: string, element: DefinitionElement) {
  // Complete aliases
  element.aliases = getAliases(name, element);
  // Set kind to Option if missing
  element.kind = element.kind ?? Kind.OPTION;
  // Set option type to string if missing
  if (element.kind === Kind.OPTION && !element.type) {
    element.type = Type.STRING;
  }
  // Add name as key
  element.key = name;
  for (const optionKey in element.options ?? {}) {
    completeElementDefinition(optionKey, element.options![optionKey]);
  }
}

/** Process incoming args based on provided definition */
export function parseArguments(
  args: string[],
  definition: Definition<DefinitionElement>,
  cliOptions: CliOptions
): ParsingOutput {
  const output: ParsingOutput = {
    location: [],
    options: {},
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

  let definitionRef = definition;
  const optsAliases = [];
  argsLoop: for (const arg of args) {
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
          output.error = CliError.format(ErrorType.COMMAND_NOT_FOUND, arg, suggestion);
        }
        break argsLoop;
      }
      if (element.kind === Kind.COMMAND) {
        if (element.type === undefined) {
          argsToProcess = argsToProcess.slice(1);
        }
        if (output.location.length === 0) {
          output.location.push(cliOptions.commandsPath);
        }
        output.location.push(key);
        // No more namespaces/commands are allowed to follow, so end
        break argsLoop;
      }
      // Namespaces will follow here
      argsToProcess = argsToProcess.slice(1);
      output.location.push(key);
      definitionRef = definitionRef[key].options || {};
      break;
    }
  }

  const defElement = getDefinitionElement(definition, output.location, cliOptions)!;
  // Process all element aliases and defaults
  const defToProcess = output.location.length > 0 ? { "": defElement, ...defElement.options } : definition;
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
      const parserOutput = parseOptionValue(evaluatedValue, output.options[outputKey], {
        ...optionDefinition,
        key: curr,
      } as Option);
      if (parserOutput.error && !output.error) {
        output.error = parserOutput.error;
      } else if (!parserOutput.error) {
        output.options[outputKey] = parserOutput.value;
      }
      i += parserOutput.next;
    } else if (!aliases.hasOwnProperty(optionKey) && !output.error) {
      // Unknown option
      output.error = CliError.format(ErrorType.OPTION_NOT_FOUND, curr);
    }
  }

  // Process value-transformations
  Object.values(aliases)
    .filter((v) => typeof v !== "string" && typeof v.value === "function")
    .forEach((v) => {
      const k = (v as Option).key!;
      output.options[k] = (v as Option).value!(output.options[k], { ...output.options });
    });

  return output;
}

/** Given the processed options, determine the script location and invoke it with the processed options */
export async function executeScript(
  { location, options }: ParsingOutput,
  cliOptions: CliOptions,
  definition: Definition<DefinitionElement>
) {
  const base = cliOptions.baseScriptLocation;
  if (!base) {
    return logErrorAndExit("There was a problem finding base script location");
  }
  const entryFile = path.parse(getEntryFile());

  const scriptPaths = [path.join(...location, "index"), location.length > 0 ? path.join(...location) : entryFile.name]
    .filter((p) => p)
    .map((p) => path.join(base, p!.concat(entryFile.ext)));

  const validScriptPath = scriptPaths.find(fs.existsSync);

  if (!validScriptPath) {
    let errorMessage = "";
    if (cliOptions.onFail.help) {
      generateScopedHelp(definition, [], cliOptions);
      errorMessage = "\n";
    }
    errorMessage += "There was a problem finding the script to run.";
    if (cliOptions.onFail.scriptPaths) {
      errorMessage += " Considered paths were:\n";
      errorMessage = scriptPaths.reduce((acc, sp) => "".concat(acc, "  ", sp, "\n"), errorMessage);
    }
    return logErrorAndExit(errorMessage);
  }

  try {
    // Use "require" for cjs
    if (require.main) {
      const m = require(validScriptPath);
      return (m.default || m)(options);
    }
    return await import(url.pathToFileURL(validScriptPath).href).then(m => (m.default || m)(options))
  } catch (e: any) {
    logErrorAndExit(`There was a problem executing the script (${validScriptPath}: ${e.message})`);
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
  cliOptions: CliOptions
) {
  let location = rawLocation[0] === cliOptions.commandsPath ? rawLocation.slice(1) : rawLocation;
  const element = getDefinitionElement(definition, location, cliOptions);
  let definitionRef = definition;
  const sections: { [key in HELP_SECTIONS]?: string } = {};
  if (location.length > 0) {
    if (element && [Kind.NAMESPACE, Kind.COMMAND].includes(element.kind as Kind)) {
      sections[HELP_SECTIONS.DESCRIPTION] = element.description?.concat("\n");
      definitionRef = element.options as Definition<DefinitionElement>;
    } else {
      // Some element in location was incorrect. Output the entire help
      Cli.logger.log(`\nUnable to find the specified scope (${location.join(" > ")})\n`);
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
    { existingKinds: [] as string[], hasOptions: false }
  );

  const formatKinds = (kinds: string[]) =>
    ` ${kinds
      .sort((a) => (a === Kind.NAMESPACE ? -1 : 1))
      .join("|")
      .toUpperCase()}`;

  sections[HELP_SECTIONS.USAGE] = [
    `Usage:  ${cliOptions.cliName}`,
    location.length > 0 ? ` ${location.join(" ")}` : "",
    existingKinds.length > 0 ? formatKinds(existingKinds) : "",
    element?.kind === Kind.COMMAND && element!.type !== undefined ? ` <${element!.type}>` : "",
    hasOptions ? " [OPTIONS]" : "",
    "\n",
  ].join("");
  generateHelp(definitionRef, cliOptions, sections);
}

/** Print the resulting documentation of formatting the given definition */
function generateHelp(
  definition: Definition<DefinitionElement> = {},
  cliOptions: CliOptions,
  sections: { [key in HELP_SECTIONS]?: string } = {}
) {
  const formatter = new ColumnFormatter();
  const sectionIndentation = 2;

  type ExtendedDefinitionElement = DefinitionElement & { name: string };
  type ElementSections = { [key in HELP_SECTIONS]?: { title: string; content: ExtendedDefinitionElement[] } };

  // Generate the formatted versions of aliases
  const formatAliases = (aliases: string[] = []) => aliases.join(", ");
  // Generate default-value hint, if present
  const defaultHint = (option: DefinitionElement) =>
    option.default !== undefined ? ` (default: ${option.default})` : "";
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
    [HELP_SECTIONS.NAMESPACES]: {
      title: "Namespaces:",
      content: [],
    },
    [HELP_SECTIONS.COMMANDS]: {
      title: "Commands:",
      content: [],
    },
    [HELP_SECTIONS.OPTIONS]: {
      title: "Options:",
      content: [],
    },
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
          acc.elementSections[sectionKey].content.push(completeElement);
          return acc;
        },
        { elementSections: elementSectionsTemplate, formattedNames: [] }
      );

  // Process all names from namespaces, commands and options into formatter
  formatter.process("name", formattedNames);

  // Format all element-sections
  Object.entries(elementSections)
    .filter(([_, section]) => section.content.length > 0)
    .forEach(([sectionKey, { title, content }]) => {
      let sectionContent = `${title}\n`;
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
  cliOptions: CliOptions
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
  cliOptions: CliOptions
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
