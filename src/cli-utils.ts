import path from "path";
import fs from "fs";
import { ColumnFormatter, Logger } from "./utils";
import { Kind, ParsingOutput, Definition, Type, DefinitionElement, CliOptions, OptionValue } from "./types";

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
export function completeDefinition(definition: Definition, cliOptions: CliOptions) {
  // Auto-include help option
  if (cliOptions.help.autoInclude) {
    definition.help = {
      type: "boolean",
      aliases: cliOptions.help.aliases,
      description: "Display global help, or scoped to a namespace/command",
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
  // Include default description if missing
  element.description = element.description ?? "-";
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
export function parseArguments(args: string[], definition: Definition, cliOptions: CliOptions): ParsingOutput {
  const output: ParsingOutput = {
    location: [],
    options: {},
  };
  const aliases: { [key: string]: DefinitionElement | string } = {};

  const processElement = (element: DefinitionElement) => {
    const [mainAlias, ...otherAliases] = element.aliases!;
    aliases[mainAlias] = element;
    // The remaining aliases will point to the name of the main alias
    otherAliases.forEach((alias: string) => {
      aliases[alias] = mainAlias;
    });
  };

  // Only process global options if no args are provided
  if (args.length === 0) {
    Object.entries(definition)
      .filter(([_, e]) => e.kind === Kind.OPTION)
      .forEach(([key, element]) => {
        processElement(element);
        output.options[key] = element.default;
      });
  } else {
    let definitionRef = definition;
    argsLoop: for (const arg of args) {
      // Sort definition to process options first
      const entries = Object.entries(definitionRef ?? {}).sort(([_, a]) => (a.kind === Kind.OPTION ? -1 : 1));
      for (let i = 0; i < entries.length; i++) {
        const [key, element] = entries[i];
        //Do not include namespaces in aliases, as they will never have any value associated
        if (element.kind !== Kind.NAMESPACE) {
          processElement(element);
        }
        if (element.kind === Kind.OPTION) {
          output.options[key] = element.default;
        } else if (element.aliases!.includes(arg)) {
          if (element.kind === Kind.COMMAND) {
            output.options[key] = element.default;
            if (output.location.length === 0) {
              output.location.push(cliOptions.commandsPath);
            }
          }
          output.location.push(key);
          definitionRef = definitionRef[key].options as Definition;
          break;
        } else if (i === entries.length - 1) {
          // Options already processed, and no namespace/command found for current arg, so end
          break argsLoop;
        }
      }
    }
  }

  // Process args
  for (let i = 0; i < args.length; i++) {
    const curr = args[i],
      next = args[i + 1];
    const optionKey = typeof aliases[curr] === "string" ? (aliases[curr] as string) : curr;
    const optionDefinition = aliases[optionKey] as DefinitionElement;
    const outputKey = optionDefinition && (optionDefinition.key as string);
    if (aliases.hasOwnProperty(curr) && !aliases.hasOwnProperty(next) && next !== undefined) {
      output.options[outputKey] = evaluateValue(next, output.options[outputKey], optionDefinition.type as Type);
      i++; // skip next array value, already processed
    } else if (aliases.hasOwnProperty(optionKey) && (aliases[optionKey] as DefinitionElement).type === Type.BOOLEAN) {
      output.options[outputKey] = true;
    }
  }
  return output;
}

/** Evaluate the value of an option */
function evaluateValue(value: string, current: OptionValue, type?: Type) {
  if (type === Type.BOOLEAN) {
    return [true, "true"].includes(value);
  } else if (type === Type.LIST) {
    let newValue;
    if (Array.isArray(value)) {
      newValue = value;
    }
    newValue = typeof value === "string" ? value.split(",") : [];
    return ((current as string[]) || []).concat(newValue);
  }
  return value;
}

/** Given the processed options, determine the script location and invoke it with the processed options */
export function executeScript({ location, options }: ParsingOutput, cliOptions: CliOptions, definition: Definition) {
  const base = cliOptions.baseScriptLocation;
  if (!base) {
    Logger.error("There was a problem finding base script location");
    return;
  }
  if (location.length === 0) {
    if (cliOptions.help.showOnFail) {
      generateHelp(definition);
    } else {
      Logger.error("No location provided to execute the script");
    }
    return;
  }
  const scriptPaths = [
    path.join(...location).concat(`.${cliOptions.extension}`),
    path.join(...location, `index.${cliOptions.extension}`),
  ].map((p) => path.join(base, p));

  const validScriptPath = scriptPaths.find(fs.existsSync);

  try {
    //@ts-expect-error if no script path was found, the failed require will be captured in the catch below
    require(validScriptPath)(options);
  } catch (_) {
    if (cliOptions.help.showOnFail) {
      generateScopedHelp(definition, location, cliOptions);
    }
    Logger.error("There was a problem finding the script to run. Considered paths were:");
    scriptPaths.forEach((sp) => Logger.log("  ".concat(sp)));
  }
}

export function generateScopedHelp(definition: Definition, location: string[], cliOptions: CliOptions) {
  let definitionRef = definition;
  if (location.length > 0) {
    let elementInfo = "";
    const element = getDefinitionElement(definition, location, cliOptions);
    if (element && [Kind.NAMESPACE, Kind.COMMAND].includes(element.kind as Kind)) {
      elementInfo += `\n${element.description}\n`;
      definitionRef = element.options as Definition;
    } else {
      //Some element in location was incorrect. Output the entire help
      elementInfo = `\nUnable to find the specified scope (${location.join(" > ")})\n`;
    }
    Logger.raw(elementInfo);
  }
  generateHelp(definitionRef);
}

/** Print the resulting documentation of formatting the given definition */
function generateHelp(definition: Definition = {}) {
  const formatter = new ColumnFormatter();
  const sectionIndentation = 2;
  enum Section {
    namespaces,
    commands,
    options,
  }
  let formattedHelp = "\n";

  type ExtendedDefinitionElement = DefinitionElement & { name: string };
  type Sections = { [key in Section]: { title: string; content: ExtendedDefinitionElement[] } };

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
      element.description,
      defaultHint(element),
      "\n",
    ].join("");

  // Initialize sections
  const sectionsTemplate: Sections = {
    [Section.namespaces]: {
      title: "Namespaces:",
      content: [],
    },
    [Section.commands]: {
      title: "Commands:",
      content: [],
    },
    [Section.options]: {
      title: "Global options:",
      content: [],
    },
  };

  // Caculate all sections and process section values
  const { sections, formattedNames }: { sections: Sections; formattedNames: string[] } = Object.entries(
    definition
  ).reduce(
    (acc: any, [key, element]) => {
      let section,
        name = key;
      if (element.kind === Kind.NAMESPACE) {
        section = Section.namespaces;
      } else if (element.kind === Kind.COMMAND) {
        section = Section.commands;
      } else {
        section = Section.options;
        name = formatAliases(element.aliases);
      }
      const completeElement = { ...element, name };
      acc.formattedNames.push(name);
      acc.sections[section].content.push(completeElement);
      return acc;
    },
    { sections: sectionsTemplate, formattedNames: [] }
  );

  // Process all names from namespaces, commands and options into formatter
  formatter.process("name", formattedNames);

  // Format all sections
  formattedHelp = Object.values(sections)
    .filter((section) => section.content.length > 0)
    .reduce((acc, { title, content }) => {
      acc += `${title}\n`;
      content.forEach((item: ExtendedDefinitionElement) => {
        acc += formatElement(item, formatter, sectionIndentation);
      });
      acc += "\n";
      return acc;
    }, formattedHelp);

  Logger.raw(formattedHelp);
}

/** Get the scoped definition element for the given location */
export function getDefinitionElement(
  definition: Definition,
  rawLocation: string[],
  cliOptions: CliOptions
): DefinitionElement | undefined {
  let definitionRef = definition;
  const location = rawLocation[0] === cliOptions.commandsPath ? rawLocation.slice(1) : rawLocation;
  for (let i = 0; i < location.length; i++) {
    const key = location[i];
    if (i === location.length - 1) {
      return definitionRef[key];
    } else if (
      definitionRef.hasOwnProperty(key) &&
      [Kind.NAMESPACE, Kind.COMMAND].includes(definitionRef[key].kind as Kind)
    ) {
      definitionRef = definitionRef[key].options as Definition;
    } else {
      return undefined;
    }
  }
  return definitionRef;
}
