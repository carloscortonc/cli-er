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

type BasicElement = {
  /** Kind of element */
  kind?: ValueOf<Kind>;
  /** Description of the element */
  description?: string;
  /** Aliases for an option */
  aliases?: string[];
  /** Used internally to identify options */
  key?: string;
  /** Whether to show an element when generating help */
  hidden?: boolean;
};

export type Option = BasicElement & {
  type?: ValueOf<Type>;
  /** Default value for the option */
  default?: OptionValue;
};

export type Namespace = BasicElement & {
  /** Nested options definition */
  options?: Definition;
};

export type Command = Option & {
  /** Nested options definition */
  options?: Definition<Option>;
  /** Action to be executed when matched */
  action?: (out: ParsingOutput) => void;
};

export type Definition<T = Namespace | Command | Option> = {
  [key: string]: T;
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
  /** extension of the script files to be executed
   * @deprecated since v0.5.0, will be removed in v0.6.0. Now is extracted from `path.extname(entryFile)`
   */
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
    /** End `run` invocation when an unknown option is encountered while parsing */
    stopOnUnknownOption: boolean;
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
