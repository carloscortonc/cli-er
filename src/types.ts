import { ErrorType } from "./cli-errors";

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

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type BasicElement = {
  /** Kind of element */
  kind?: `${Kind}`;
  /** Description of the element */
  description?: string;
  /** Aliases for an option */
  aliases?: string[];
  /** Whether to show an element when generating help */
  hidden?: boolean;
};

export type Option = BasicElement & {
  kind?: `${Kind.OPTION}`;
  /** Type of option */
  type?: `${Type}`;
  /** Default value for the option */
  default?: OptionValue;
  /** Whether is required or not
   * @default false
   */
  required?: boolean;
  /** Method to modify an option value after parsing */
  value?: (v: OptionValue, o: ParsingOutput["options"]) => OptionValue;
};

export type Namespace = BasicElement & {
  kind?: `${Kind.NAMESPACE}`;
  /** Nested options definition */
  options?: Definition;
};

export type Command = Omit<Option, "kind"> & {
  kind: `${Kind.COMMAND}`;
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
  /** Errors originated while parsing */
  errors: string[];
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
  /** Path where the single-command scripts (not contained in any namespace) are stored
   * @default "commands" 
  */
  commandsPath: string;
  /** Flags used to describe the behaviour on fail conditions
   * @deprecated Will be removed in 0.11.0
  */
  onFail: {
    /** Print scoped-help
     * @deprecated Is now under `CliOptions.debug` since 0.10.0. Will be removed in 0.11.0
    */
    help: boolean;
    /** Show suggestion when command not found
     * @deprecated Has no effect since 0.10.0. Will be removed in 0.11.0
    */
    suggestion: boolean;
    /** Print evaluated script paths inside `run`
     * @deprecated Is now under `CliOptions.debug` since 0.10.0. Will be removed in 0.11.0
    */
    scriptPaths: boolean;
    /** End `run` invocation when an unknown option is encountered while parsing
     * @deprecated Is configured via `CliOptions.errors.onExecuteCommand` since 0.10.0. Will be removed in 0.11.0
     */
    stopOnUnknownOption: boolean;
  };
  /** Configuration related to when errors should be displayed */
  errors: {
    /** List of error-types that will be displayed before help */
    onGenerateHelp: `${ErrorType}`[],
    /** List of error-types that will cause to end execution with `exit(1)` */
    onExecuteCommand: `${ErrorType}`[],
  },
  /** Help-related configuration */
  help: Option & {
    /** Whether to generate help option */
    autoInclude: boolean;
    /* Template to be used when generating help */
    template: string;
  };
  /** Version related configuration */
  version: Option & {
    /** Whether to generate version option */
    autoInclude: boolean;
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
  /** Cli description to be used instead of the one defined in package.json
   * @default packageJson.description
   */
  cliDescription: string;
  /** Enable debug mode
   * @default `process.env.CLIER_DEBUG`
  */
  debug: boolean;
};
