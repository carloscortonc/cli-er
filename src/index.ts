import {
  completeDefinition,
  parseArguments,
  executeScript,
  generateScopedHelp,
  getDefinitionElement,
  formatVersion,
  getEntryPoint,
} from "./cli-utils";
import { Definition, ParsingOutput, CliOptions, DeepPartial, DefinitionElement } from "./types";
import { clone, Logger, merge } from "./utils";
import { CliError, ErrorType } from "./cli-errors";

export default class Cli {
  definition: Definition;
  options: CliOptions;
  /** Creates a new Cli instance
   *
   * @param {Definition} definition The definition of the cli application
   * @param {DeepPartial<CliOptions>} options Options to customize the behavior of the tool
   */
  constructor(definition: Definition, options: DeepPartial<CliOptions> = {}) {
    this.options = {
      extension: "js",
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
        showOnFail: true,
      },
      version: {
        autoInclude: true,
        aliases: ["-v", "--version"],
        description: "Display version",
      },
    };
    merge(this.options, options);
    this.definition = completeDefinition(clone(definition), this.options);
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
  run(args?: string[]) {
    const args_ = Array.isArray(args) ? args : process.argv.slice(2);
    const opts = this.parse(args_);
    const command = getDefinitionElement(this.definition, opts.location, this.options) as DefinitionElement;

    // Evaluate auto-included help
    if (this.options.help.autoInclude && opts.options.help) {
      return generateScopedHelp(this.definition, opts.location, this.options);
    } else if (this.options.help.autoInclude) {
      delete opts.options.help;
    }
    // Evaluate auto-included version
    if (this.options.version.autoInclude && opts.options.version) {
      return formatVersion(this.options);
    } else if (this.options.version.autoInclude) {
      delete opts.options.version;
    }
    // Check if any error was generated
    const e = CliError.analize(opts.error);
    if (
      (e === ErrorType.COMMAND_NOT_FOUND && this.options.onFail.suggestion) ||
      (e === ErrorType.OPTION_NOT_FOUND && this.options.onFail.stopOnUnknownOption)
    ) {
      return Logger.error(opts.error);
    }
    if (typeof command.action === "function") {
      return command.action(opts);
    }
    executeScript(opts, this.options, this.definition);
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
