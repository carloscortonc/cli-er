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
import { clone, logErrorAndExit, merge, findPackageJson, CLIER_DEBUG_KEY } from "./utils";
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
    const packagejson: any = findPackageJson(options.baseLocation || getEntryPoint()) || {};
    this.options = {
      baseLocation: getEntryPoint(),
      baseScriptLocation: getEntryPoint(),
      commandsPath: "commands",
      errors: {
        onGenerateHelp: [ErrorType.COMMAND_NOT_FOUND],
        onExecuteCommand: [
          ErrorType.COMMAND_NOT_FOUND,
          ErrorType.OPTION_WRONG_VALUE,
          ErrorType.OPTION_REQUIRED,
          ErrorType.OPTION_MISSING_VALUE,
          ErrorType.OPTION_NOT_FOUND,
        ],
      },
      help: {
        autoInclude: true,
        type: "boolean",
        aliases: ["-h", "--help"],
        description: "Display global help, or scoped to a namespace/command",
        template: "\n{usage}\n{description}\n{namespaces}\n{commands}\n{options}\n",
      },
      version: {
        autoInclude: true,
        type: "boolean",
        aliases: ["-v", "--version"],
        description: "Display version",
        hidden: true,
      },
      rootCommand: true,
      cliName: packagejson.name || path.parse(getEntryFile()).name,
      cliVersion: packagejson.version || "-",
      cliDescription: packagejson.description || "",
      debug: false,
    };
    // Allow to override logger implementation
    Object.assign(Cli.logger, options.logger || {});
    // Environment variables should have the highest priority
    const envOverwriteProperties = {
      ...(process.env[CLIER_DEBUG_KEY]
        ? { debug: !["false", "0", "", undefined].includes(process.env[CLIER_DEBUG_KEY]?.toLowerCase()!) }
        : {}),
    };
    merge(this.options, options, envOverwriteProperties);
    // Store back at process.env.CLIER_DEBUG the final value of CliOptions.debug, to be accesible without requiring CliOptions
    process.env[CLIER_DEBUG_KEY] = this.options.debug ? "1" : "";
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
    const errors = opts.errors.map((e) => ({ type: CliError.analize(e)!, e })).filter(({ e }) => e);

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
      const onGenHelp = this.options.errors.onGenerateHelp;
      const onGenerateHelpErrors = errors
        .filter((e) => onGenHelp.includes(e.type))
        .sort((a, b) => onGenHelp.indexOf(a.type) - onGenHelp.indexOf(b.type));
      if (onGenerateHelpErrors.length > 0) {
        Cli.logger.error(onGenerateHelpErrors[0].e, "\n");
      }
      return generateScopedHelp(this.definition, opts.location, this.options);
    } else if (this.options.help.autoInclude) {
      delete opts.options.help;
    }

    // Check if any error was generated
    const onExecCmd = this.options.errors.onExecuteCommand;
    const onExecuteCommandErrors = errors
      .filter((e) => onExecCmd.includes(e.type))
      .sort((a, b) => onExecCmd.indexOf(a.type) - onExecCmd.indexOf(b.type));
    if (onExecuteCommandErrors.length > 0) {
      return logErrorAndExit(onExecuteCommandErrors[0].e);
    }
    if (typeof command.action === "function") {
      return command.action(opts);
    }
    return executeScript(opts, this.options);
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
