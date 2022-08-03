export enum Kind {
  NAMESPACE = "namespace",
  COMMAND = "command",
  OPTION = "option",
}
export enum Type {
  BOOLEAN = "boolean",
  LIST = "list",
}

type OptionValue = string | boolean | string[] | undefined;

export type DefinitionElement = {
  /** Kind of element */
  kind?: Kind;
  /** Nested options definition */
  options?: Definition;
  /** Description of the element */
  description?: string;
  /** Type of option */
  type?: Type;
  /** Default value for the option */
  default: OptionValue;
  /** Aliases for an option */
  aliases?: string[];
  /** Used internally to identify options */
  key?: string;
};

export type Definition = {
  [key: string]: DefinitionElement;
};

export type ParsingOutput = {
  /** List of directories that leads to the calculated script location */
  location: string[];
  /** Calculated options */
  options: { [key: string]: OptionValue | undefined };
};

export type CliOptions = {
  /** extension of the script files to be executed */
  extension: "js";
  /** Base path where the `ProcessingOutput.location` will start from */
  baseScriptLocation: string;
  /** Path where the single-command scripts (not contained in any namespace) are stored */
  commandsPath: string;
};
