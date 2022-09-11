import path from "path";
import fs from "fs";
import readPackageUp from "read-pkg-up";
import { closest } from "fastest-levenshtein";
import { ColumnFormatter, Logger } from "./utils";
import { Kind, ParsingOutput, Definition, Type, DefinitionElement, CliOptions, OptionValue } from "./types";

/** Get the file location of the main cli application */
function getEntryFile() {
  return require.main ? require.main.filename : process.cwd();
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
export function completeDefinition(definition: Definition, cliOptions: CliOptions) {
  // Auto-include help option
  if (cliOptions.help.autoInclude) {
    definition.help = {
      type: "boolean",
      aliases: cliOptions.help.aliases,
      description: cliOptions.help.description,
    };
  }
  //Auto-include version option
  if (cliOptions.version.autoInclude) {
    definition.version = {
      type: "boolean",
      aliases: cliOptions.version.aliases,
      description: cliOptions.version.description,
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
    //Do not include namespaces in aliases, as they will never have any value associated
    if (element.kind === Kind.NAMESPACE) {
      return;
    }
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
        processElement(element);
        if (element.kind === Kind.OPTION) {
          output.options[key] = element.default;
        } else if (element.aliases!.includes(arg)) {
          if (element.kind === Kind.COMMAND) {
            if (element.type !== undefined) {
              output.options[key] = element.default;
            }
            if (output.location.length === 0) {
              output.location.push(cliOptions.commandsPath);
            }
            output.location.push(key);
            Object.entries((definitionRef[key].options as Definition) || {}).forEach(([optionKey, optionDef]) => {
              processElement(optionDef);
              output.options[optionKey] = optionDef.default;
            });
            // No more namespaces/commands are allowed to follow, so end
            break argsLoop;
          }
          output.location.push(key);
          definitionRef = definitionRef[key].options as Definition;
          break;
        } else if (i === entries.length - 1) {
          // Options already processed, and no namespace/command found for current arg, so end
          const suggestion = closestSuggestion(arg, definition, output.location, cliOptions);
          output.error = `Command "${arg}" not found. Did you mean "${suggestion}" ?`;
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
  } else if (type === Type.NUMBER) {
    return parseInt(value);
  }
  return value;
}

/** Given the processed options, determine the script location and invoke it with the processed options */
export function executeScript({ location, options }: ParsingOutput, cliOptions: CliOptions, definition: Definition) {
  const base = cliOptions.baseScriptLocation;
  if (!base) {
    return Logger.error("There was a problem finding base script location");
  }

  const scriptPaths = [path.join(...location, "index"), location.length > 0 ? path.join(...location) : undefined]
    .filter((p) => p)
    .map((p) => path.join(base, p!.concat(path.extname(getEntryFile()))));

  const validScriptPath = scriptPaths.find(fs.existsSync);

  if (!validScriptPath) {
    if (cliOptions.help.showOnFail && cliOptions.onFail.help) {
      generateHelp(definition);
    }
    Logger.raw("There was a problem finding the script to run.");
    if (cliOptions.onFail.scriptPaths) {
      Logger.raw(" Considered paths were:\n");
      scriptPaths.forEach((sp) => Logger.log("  ".concat(sp)));
    }
    Logger.raw("\n");
    return;
  }

  try {
    const script = require(validScriptPath);
    (script.default || script)(options);
  } catch (e: any) {
    Logger.error(`There was a problem executing the script (${validScriptPath})`);
  }
}

export function generateScopedHelp(definition: Definition, rawLocation: string[], cliOptions: CliOptions) {
  const packagejson = findPackageJson(cliOptions);
  const location = rawLocation[0] === cliOptions.commandsPath ? rawLocation.slice(1) : rawLocation;
  const element = getDefinitionElement(definition, location, cliOptions);
  let definitionRef = definition;
  let elementInfo = "";
  if (location.length > 0) {
    if (element && [Kind.NAMESPACE, Kind.COMMAND].includes(element.kind as Kind)) {
      elementInfo += `\n${element.description}\n`;
      definitionRef = element.options as Definition;
    } else {
      //Some element in location was incorrect. Output the entire help
      elementInfo = `\nUnable to find the specified scope (${location.join(" > ")})\n`;
    }
  }
  // Add usage section
  if (packagejson) {
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

    elementInfo = [
      `\nUsage:  ${packagejson.name}`,
      location.length > 0 ? ` ${location.join(" ")}` : "",
      existingKinds.length > 0 ? formatKinds(existingKinds) : "",
      hasOptions ? " [OPTIONS]" : "",
      "\n",
    ]
      .join("")
      .concat(elementInfo);
  }
  Logger.raw(elementInfo);
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
      title: "Options:",
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

/** Find the package.json of the application that is using this library */
function findPackageJson(cliOptions: CliOptions) {
  const packagejson = readPackageUp.sync({ cwd: cliOptions.baseLocation });
  if (!packagejson || !packagejson.packageJson) {
    return undefined;
  }
  return packagejson.packageJson;
}

/** Find and format the version of the application that is using this library */
export function formatVersion(cliOptions: CliOptions) {
  if (!cliOptions.baseLocation) {
    return Logger.error("Unable to find base location. You may configure this value via CliOptions.baseLocation");
  }
  const packagejson = findPackageJson(cliOptions);
  if (!packagejson) {
    return Logger.error("Error reading package.json file");
  }
  Logger.log(`${" ".repeat(2)}${packagejson.name} version: ${packagejson.version}`);
}

/** Find the closest namespace/command based on the given target and location */
export function closestSuggestion(
  target: string,
  definition: Definition,
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
