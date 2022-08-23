import path from "path";
import { completeDefinition, parseArguments, executeScript, generateScopedHelp } from "./cli-utils";
import { Definition, ParsingOutput, CliOptions, DeepPartial } from "./types";
import { clone, merge } from "./utils";

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
      //@ts-expect-error
      baseScriptLocation: path.dirname(require.main.filename),
      commandsPath: "commands",
      help: {
        autoInclude: true,
        aliases: ["-h", "--help"],
        showOnFail: true,
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
    if (this.options.help.autoInclude && opts.options.help) {
      return generateScopedHelp(this.definition, opts.location);
    }
    executeScript(opts, this.options, this.definition);
  }
  /**
   * Generate and output help documentation
   *
   * @param {string[]} location scope to generate help
   */
  help(location: string[] = []) {
    generateScopedHelp(this.definition, location);
  }
}
