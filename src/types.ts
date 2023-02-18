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
  FLOAT = "float",
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
  /** Type of option */
  type?: ValueOf<Type>;
  /** Default value for the option */
  default?: OptionValue;
  /** Method to modify an option value after parsing */
  value?: (v: OptionValue, o: ParsingOutput["options"]) => OptionValue;
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

export enum LogType {
  LOG = "log",
  ERROR = "error",
}

export interface ICliLogger {
  /** Method for general logs. Must not add a new line at the end.
   * @default process.stdout.write("".concat(message.join(" ")));
   */
  log: (...message: any[]) => void;
  /** Method for logging errors. Must not add a new line at the end.
   * @default process.stderr.write("ERROR ".concat(message.join(" ")))
   */
  error: (...message: any[]) => void;
}

export type CliOptions = {
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
  /** Whether the cli implements a root command (invocation with no additional namespaces/commands)
   * @default true
   */
  rootCommand: boolean;
  /** Logger to be used by the cli */
  logger?: Partial<ICliLogger>;
  /** Cli name to be used instead of the one defined in package.json
   * @default packageJson.name
   */
  cliName: string;
  /** Cli version to be used instead of the one defined in package.json
   * @default packageJson.version
   */
  cliVersion: string;
};
