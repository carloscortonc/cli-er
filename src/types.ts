export enum Kind {
  NAMESPACE = "namespace",
  COMMAND = "command",
  OPTION = "option",
}

export enum Type {
  STRING = "string",
  BOOLEAN = "boolean",
  LIST = "list",
  NUMBER = "number",
}

export type OptionValue = string | boolean | string[] | number | undefined;

type ValueOf<T> = T[keyof T];

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type DefinitionElement = {
  /** Kind of element */
  kind?: ValueOf<Kind>;
  /** Nested options definition */
  options?: Definition;
  /** Description of the element */
  description?: string;
  /** Type of option */
  type?: ValueOf<Type>;
  /** Default value for the option */
  default?: OptionValue;
  /** Aliases for an option */
  aliases?: string[];
  /** Action to be executed when matched */
  action?: (out: ParsingOutput) => void;
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
  /** Error originated while parsing */
  error?: string;
};

export type CliOptions = {
  /** extension of the script files to be executed */
  extension: string;
  /** Location of the main cli application
   * @default path.dirname(require.main.filename)
   */
  baseLocation: string | undefined;
  /** Base path where the `ProcessingOutput.location` will start from
   * @default path.dirname(require.main.filename)
   */
  baseScriptLocation: string | undefined;
  /** Path where the single-command scripts (not contained in any namespace) are stored */
  commandsPath: string;
  /** Flags to describe the behaviour on fail conditions */
  onFail: {
    /** Print scoped-help */
    help: boolean;
    /** Show suggestion when command not found */
    suggestion: boolean;
    /** Print evaluated script paths inside `run` */
    scriptPaths: boolean;
  };
  /** Help-related configuration */
  help: {
    /** Whether to generate help option */
    autoInclude: boolean;
    /** Aliases to be used for help option */
    aliases: string[];
    /** Description for the option */
    description: string;
    /** Whether to print help when script run fails
     * @deprecated since v0.5.0, will be removed in v0.6.0 - use `CliOptions.onFail.help` instead
     */
    showOnFail: boolean;
  };
  /** Version related configuration */
  version: {
    /** Whether to generate version option */
    autoInclude: boolean;
    /** Aliases to be used for version option */
    aliases: string[];
    /** Description for the option */
    description: string;
  };
};
