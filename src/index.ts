import path from "path";
import fs from "fs";
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
import { clone, logErrorAndExit, merge, findPackageJson, CLIER_DEBUG_KEY, deprecationWarning, findFile } from "./utils";
import { CliError } from "./cli-errors";
import CliLogger from "./cli-logger";
import { ERROR_MESSAGES } from "./cli-errors";
import { CLI_MESSAGES, formatMessage } from "./cli-messages";
import { defineCommand, CommandOptions } from "./extract-options-type";
import { generateCompletions } from "./bash-completion";

export default class Cli {
  static logger: ICliLogger = new CliLogger();
  static messages = { ...ERROR_MESSAGES, ...CLI_MESSAGES } as const;
  static formatMessage = formatMessage;
  static defineCommand = defineCommand;
  definition: Definition;
  options: CliOptions;
  /** Creates a new Cli instance
   *
   * @param {Definition} definition The definition of the cli application
   * @param {DeepPartial<CliOptions>} options Options to customize the behavior of the tool
   */
  constructor(definition: Definition, options: DeepPartial<CliOptions> = {}) {
    const entryPoint = getEntryPoint();
    const packagejson: any = findPackageJson(entryPoint) || {};
    // Allow to override logger implementation
    Object.assign(Cli.logger, options.logger || {});
    // Allow to override messages
    Object.assign(Cli.messages, { ...(options.messages || {}) } as const);

    this.options = {
      baseLocation: entryPoint,
      baseScriptLocation: entryPoint,
      commandsPath: "commands",
      errors: {
        onGenerateHelp: ["command_not_found"],
        onExecuteCommand: [
          "command_not_found",
          "option_wrong_value",
          "option_required",
          "option_missing_value",
          "option_missing_dependencies",
          "option_not_found",
        ],
      },
      help: {
        autoInclude: true,
        type: "boolean",
        aliases: ["h", "help"],
        description: Cli.formatMessage("help.description"),
        template: "\n{usage}\n{description}\n{namespaces}\n{commands}\n{options}\n",
      },
      version: {
        autoInclude: true,
        type: "boolean",
        aliases: ["v", "version"],
        description: Cli.formatMessage("version.description"),
        hidden: true,
      },
      rootCommand: true,
      cliName: packagejson.name || path.parse(getEntryFile()).name,
      cliVersion: packagejson.version || "-",
      cliDescription: packagejson.description || "",
      debug: false,
      completion: {
        enabled: true,
        command: "generate-completions",
      },
      configFile: undefined,
      envPrefix: undefined,
    };

    // Environment variables should have the highest priority
    const envOverwriteProperties = {
      ...(process.env[CLIER_DEBUG_KEY]
        ? { debug: !["false", "0", "", undefined].includes(process.env[CLIER_DEBUG_KEY]?.toLowerCase()!) }
        : {}),
    };
    merge(this.options, options, envOverwriteProperties);
    // `CliOptions.baseScriptLocation` is deprecated and renamed to preexisting `CliOptions.baseLocation`
    if (options.baseScriptLocation) {
      this.options.baseLocation = this.options.baseScriptLocation;
      deprecationWarning({ property: "CliOptions.baseScriptLocation", alternative: "CliOptions.baseLocation" });
    }
    // Transform `CliOptions.baseLocation` into an absolute path
    if (!path.isAbsolute(this.options.baseLocation)) {
      this.options.baseLocation = path.resolve(entryPoint, this.options.baseLocation);
    }
    // Regularize CliOptions.commandsPath into relative path to CliOptions.baseLocation
    if (path.isAbsolute(this.options.commandsPath)) {
      this.options.commandsPath = path.relative(this.options.baseLocation, this.options.commandsPath) || ".";
    }
    // Store back at process.env.CLIER_DEBUG the final value of CliOptions.debug, to be accesible without requiring CliOptions
    process.env[CLIER_DEBUG_KEY] = this.options.debug ? "1" : "";
    // Do this so we can provide "completeDefinition" with a reference to "this.definition"
    this.definition = clone(definition);
    this.definition = completeDefinition(this.definition, this.options) as Definition;

    return this;
  }
  /**
   * Process the provided arguments and return the final options
   *
   * @param {string[]} args list of arguments to be processed
   */
  parse(args: string[]): ParsingOutput {
    return parseArguments({ args, definition: this.definition, cliOptions: this.options });
  }
  /**
   * Run the provided argument list. This defaults to `process.argv.slice(2)`
   *
   * @param {string[]} args list of arguments to be processed
   */
  run(args?: string[]): void | Promise<void> {
    const args_ = Array.isArray(args) ? args : process.argv.slice(2);
    const opts = parseArguments({
      args: args_,
      definition: this.definition,
      cliOptions: this.options,
      initial: { ...this.configContent(), ...this.envContent() },
    });
    // Include CliOptions.rootCommand if empty location provided
    const elementLocation =
      opts.location.length === 0 && typeof this.options.rootCommand === "string"
        ? [this.options.rootCommand]
        : opts.location;
    const command = getDefinitionElement(this.definition, elementLocation, this.options)!;
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
        (this.options.rootCommand === false && opts.location.length === 0) ||
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

    // Check if any error were generated
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
    return executeScript({ ...opts, location: elementLocation }, this.options);
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
  /**
   * Find nearest configuration file. Returns undefined if:
   * - options.configFile is not specified
   * - no configuration file is found
   * - an error is generated while parsing contents
   */
  configContent() {
    if (!this.options.configFile || this.options.configFile.names.length === 0) {
      return;
    }
    const file = findFile(process.cwd(), this.options.configFile.names);
    if (!file) {
      return;
    }
    try {
      const content = fs.readFileSync(file, "utf-8");
      return (this.options.configFile.parse || ((c: string) => JSON.parse(c)))(content, file);
    } catch {
      // silent error
    }
    return;
  }
  /** If `CliOptions.envPrefix` is defined, extract options from environment variables
   * matching that value
   */
  envContent() {
    const p = this.options.envPrefix;
    if (!p) {
      return;
    }
    return Object.entries(process.env)
      .filter(([k]) => k.startsWith(p))
      .reduce((acc, [k, v]) => ({ ...acc, [k.replace(new RegExp("^".concat(p)), "").toLowerCase()]: v }), {});
  }
  /**
   * Output bash-completion script contents
   */
  completions() {
    generateCompletions({ definition: this.definition, cliOptions: this.options });
  }
}

// Export of types not used anywhere in the codebase
export type { CommandOptions };
