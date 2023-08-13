import { CliError, ErrorType } from "./cli-errors";

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

export type ValueParserInput = {
  /** Value to process */
  value: string | undefined;
  /** Current value of the option */
  current: OptionValue;
  /** Option definition */
  option: Option & { key: string };
  /** Method for formatting errors, to be used in `Option.parser` */
  format: typeof CliError.format;
};

export type ValueParserOutput = {
  /** Final value for the parsed option */
  value?: any;
  /** Number of additional arguments that the parser consumed. For example, a boolean option
   * might not consume any additional arguments ("--show-config", next=0) while a string option
   * would ("--path path-value", next=1). The main case of `next=0` is when incoming value is `undefined`
   */
  next?: number;
  /** Error generated during parsing */
  error?: string;
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

type BaseElement = {
  /** Kind of element */
  kind?: `${Kind}`;
  /** Description of the element */
  description?: string;
  /** Whether to show an element when generating help */
  hidden?: boolean;
};

export type Option = BaseElement & {
  kind?: `${Kind.OPTION}`;
  /** Aliases for an option */
  aliases?: string[];
  /** Type of option */
  type?: `${Type}`;
  /** Whether the option is positional.
   * If `true`, all unknown options found will be included in this option
   * If a number is provided, a param placed at that given position will be assigned
   * to this option, only if that value does not correspond with any other existing aliases
   * @default false
   */
  positional?: boolean | number;
  /** If type=boolean, whether to include negated aliases
   * e.g. --debug => --no-debug/--nodebug
   * @default false
   */
  negatable?: boolean;
  /** Default value for the option */
  default?: OptionValue;
  /** Whether is required or not
   * @default false
   */
  required?: boolean;
  /** Method to modify an option value after parsing
   * @deprecated in favor of `Option.parser`. Will be removed in 0.12.0
   */
  value?: (v: OptionValue, o: ParsingOutput["options"]) => OptionValue;
  /** Custom parser for the option */
  parser?: (input: ValueParserInput) => ValueParserOutput;
};

export type Namespace = BaseElement & {
  kind?: `${Kind.NAMESPACE}`;
  /** Nested options definition */
  options?: Definition;
};

export type Command = Omit<Option, "kind" | "aliases"> & {
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
  /** Location based solely on supplied namespaces/commands */
  location: string[];
  /** Calculated options */
  options: { _: string[]; [key: string]: OptionValue | undefined };
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

export type Messages = { [key in ErrorType | string]: string };

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
  /** Configuration related to when errors should be displayed */
  errors: {
    /** List of error-types that will be displayed before help */
    onGenerateHelp: `${ErrorType}`[];
    /** List of error-types that will cause to end execution with `exit(1)` */
    onExecuteCommand: `${ErrorType}`[];
  };
  /** Help-related configuration */
  help: Option & {
    /** Whether to generate help option */
    autoInclude?: boolean;
    /* Template to be used when generating help */
    template?: string;
  };
  /** Version related configuration */
  version: Option & {
    /** Whether to generate version option */
    autoInclude: boolean;
  };
  /** Whether the cli implements a root command (invocation with no additional namespaces/commands)
   * If a string is provided, it will be used as the default command to execute
   * @default true
   */
  rootCommand: boolean | string;
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
  /** Messages to be used, overriding the ones defined by this library
   * This allows to include new translations, or tweak the current ones
   */
  messages?: Messages;
};
