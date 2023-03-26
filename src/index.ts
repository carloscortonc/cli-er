import {
  completeDefinition,
  parseArguments,
  executeScript,
  generateScopedHelp,
  getDefinitionElement,
  formatVersion,
  getEntryPoint,
  getEntryFile,
} from "./cli-utils";
import { Definition, ParsingOutput, CliOptions, DeepPartial, ICliLogger, Kind } from "./types";
import { clone, logErrorAndExit, merge, findPackageJson } from "./utils";
import { CliError, ErrorType } from "./cli-errors";
import CliLogger from "./cli-logger";
import path from "path";

export default class Cli {
  static logger: ICliLogger = new CliLogger();
  definition: Definition;
  options: CliOptions;
  /** Creates a new Cli instance
   *
   * @param {Definition} definition The definition of the cli application
   * @param {DeepPartial<CliOptions>} options Options to customize the behavior of the tool
   */
  constructor(definition: Definition, options: DeepPartial<CliOptions> = {}) {
    this.options = {
      baseLocation: getEntryPoint(),
      baseScriptLocation: getEntryPoint(),
      commandsPath: "commands",
      onFail: {
        help: true,
        suggestion: true,
        scriptPaths: true,
        stopOnUnknownOption: true,
      },
      help: {
        autoInclude: true,
        aliases: ["-h", "--help"],
        description: "Display global help, or scoped to a namespace/command",
        template: "\n{usage}\n{description}\n{namespaces}\n{commands}\n{options}\n",
      },
      version: {
        autoInclude: true,
        aliases: ["-v", "--version"],
        description: "Display version",
      },
      rootCommand: true,
      cliName: "",
      cliVersion: "",
      cliDescription: "",
    };
    // Allow to override logger implementation
    Object.assign(Cli.logger, options.logger || {});
    merge(this.options, options);
    // Read cliName and cliVersion from package.json, if not provided
    const packagejson: any = findPackageJson(this.options) || {};
    if (!this.options.cliName) {
      this.options.cliName = packagejson.name || path.parse(getEntryFile()).name;
    }
    if (!this.options.cliVersion) {
      this.options.cliVersion = packagejson.version || "-";
    }
    if (!this.options.cliDescription) {
      this.options.cliDescription = packagejson.description || "";
    }
    this.definition = completeDefinition(clone(definition), this.options) as Definition;
    return this;
  }
  /**
   * Process the provided arguments and return the final options
   *
   * @param {string[]} args list of arguments to be processed
   */
  parse(args: string[]): ParsingOutput {
    return parseArguments(args, this.definition, this.options);
  }
  /**
   * Run the provided argument list. This defaults to `process.argv.slice(2)`
   *
   * @param {string[]} args list of arguments to be processed
   */
  run(args?: string[]): void | Promise<void> {
    const args_ = Array.isArray(args) ? args : process.argv.slice(2);
    const opts = this.parse(args_);
    const command = getDefinitionElement(this.definition, opts.location, this.options)!;
    const e = CliError.analize(opts.error);

    // Evaluate auto-included version
    if (this.options.version.autoInclude && opts.options.version) {
      return formatVersion(this.options);
    } else if (this.options.version.autoInclude) {
      delete opts.options.version;
    }
    // Evaluate auto-included help
    if (
      this.options.help.autoInclude &&
      (opts.options.help ||
        (!this.options.rootCommand && opts.location.length === 0) ||
        command.kind === Kind.NAMESPACE)
    ) {
      if (opts.error && e !== ErrorType.OPTION_REQUIRED) {
        Cli.logger.error(opts.error, "\n");
      }
      return generateScopedHelp(this.definition, opts.location, this.options);
    } else if (this.options.help.autoInclude) {
      delete opts.options.help;
    }

    // Check if any error was generated
    if (
      (e === ErrorType.COMMAND_NOT_FOUND && this.options.onFail.suggestion) ||
      ([ErrorType.OPTION_NOT_FOUND, ErrorType.OPTION_WRONG_VALUE, ErrorType.OPTION_MISSING_VALUE, ErrorType.OPTION_REQUIRED].includes(
        e as ErrorType
      ) &&
        this.options.onFail.stopOnUnknownOption)
    ) {
      return logErrorAndExit(opts.error);
    }
    if (typeof command.action === "function") {
      return command.action(opts);
    }
    return executeScript(opts, this.options, this.definition);
  }
  /**
   * Generate and output help documentation
   *
   * @param {string[]} location scope to generate help
   */
  help(location: string[] = []) {
    generateScopedHelp(this.definition, location, this.options);
  }
  /**
   * Print formatted version of the current cli application
   */
  version() {
    formatVersion(this.options);
  }
}
