import path from "path";
import fs from "fs";
import { ColumnFormatter, Logger } from "./utils";
import { Kind, ParsingOutput, Definition, Type, DefinitionElement, CliOptions } from "./types";

/** Determine the correct aliases depending on the kind of element */
function getAliases(key: string, element: DefinitionElement) {
  if ([Kind.NAMESPACE, Kind.COMMAND].includes(element.kind!)) {
    return [key];
  } else if (!element.aliases) {
    return [`--${key}`];
  }
  return element.aliases;
}

/** Process definition and complete any missing fields */
export function completeDefinition(definition: Definition) {
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
  const evaluateValue = (value: string, type?: Type) => {
    if (type === Type.BOOLEAN) {
      return [true, "true"].includes(value);
    } else if (type === Type.LIST) {
      if (Array.isArray(value)) {
        return value;
      }
      return typeof value === "string" ? value.split(",") : [];
    }
    return value;
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
    if (aliases.hasOwnProperty(curr) && !aliases.hasOwnProperty(next) && next !== undefined) {
      output.options[optionDefinition.key!] = evaluateValue(next, optionDefinition.type);
      i++; // skip next array value, already processed
    } else if (aliases.hasOwnProperty(curr) && (aliases[curr] as DefinitionElement).type === Type.BOOLEAN) {
      output.options[optionKey] = true;
    }
  }
  return output;
}

/** Given the processed options, determine the script location and invoke it with the processed options */
export function executeScript({ location, options }: ParsingOutput) {
  if (require.main === undefined) {
    Logger.error("There was a problem finding base script location");
    return;
  }
  const base = path.dirname(require.main.filename);
  const scriptPath = [path.join(...location).concat(".js"), path.join(...location, "index.js")]
    .map((p) => path.join(base, p))
    .find(fs.existsSync);

  try {
    //@ts-expect-error if no script path was found, the failed require will be captured in the catch below
    require(scriptPath)(options);
  } catch (_) {
    Logger.error("There was a problem finding the script to run");
  }
}

/** Print the resulting documentation of formatting the given definition */
export function generateHelp(definition: Definition) {
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

  process.stdout.write(formattedHelp);
}
