import Cli from "../src/index";
import fs from "fs";
import * as cliutils from "../src/cli-utils";
import * as utils from "../src/utils";
import _definition from "./data/definition.json";
import { CliError, ErrorType } from "../src/cli-errors";
import { Definition, Option } from "../src/types";
const definition = _definition as Definition;

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
}));
jest.spyOn(cliutils, "getEntryPoint").mockImplementation(() => "require.main.filename");
jest.spyOn(utils, "findPackageJson").mockImplementation(
  (_: any) =>
    ({
      version: "1.0.0",
      name: "cli-app",
      description: "cli-description",
    } as any),
);
jest.spyOn(utils, "findFile").mockImplementation(() => "{}");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Cli.constructor", () => {
  it("Resulting definition contains only auto-included options/commands when provided with empty definition", () => {
    const c = new Cli({});
    expect(c.definition).toStrictEqual({
      help: expect.objectContaining({
        type: "boolean",
        aliases: ["-h", "--help"],
        description: "Display global help, or scoped to a namespace/command",
      }),
      version: expect.objectContaining({
        type: "boolean",
        aliases: ["-v", "--version"],
        description: "Display version",
      }),
      "generate-completions": expect.objectContaining({
        aliases: ["generate-completions"],
        hidden: true,
      }),
    });
  });
  it("Resulting definition calculates aliases dashes when not present", () => {
    const c = new Cli(
      { opt: { aliases: ["o", "-p", "opt", "--opt2"] } },
      { help: { autoInclude: false }, version: { autoInclude: false } },
    );
    expect((c.definition.opt as Option).aliases).toStrictEqual(["-o", "-p", "--opt", "--opt2"]);
  });
  it("Resulting definition includes negated boolean option if enabled", () => {
    const c = new Cli(
      { opt: { aliases: ["o", "opt", "--opt2", "opt3"], type: "boolean", negatable: true } },
      { help: { autoInclude: false }, version: { autoInclude: false } },
    );
    expect(c.definition.optNegated).toStrictEqual(
      expect.objectContaining({
        aliases: ["--noopt", "--no-opt", "--noopt3", "--no-opt3"],
        hidden: true,
        key: "opt",
        kind: "option",
        type: "boolean",
      }),
    );
  });
  it("Resulting definition is an empty object when provided with empty definition and all auto-included options/commands are disabled", () => {
    const c = new Cli(
      {},
      { help: { autoInclude: false }, version: { autoInclude: false }, completion: { enabled: false } },
    );
    expect(c.definition).toStrictEqual({});
  });
  it("CliOptions are default when instantiating with no options", () => {
    const c = new Cli({});
    expect(c.options).toStrictEqual({
      baseLocation: "require.main.filename",
      baseScriptLocation: "require.main.filename",
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
        description: "Display global help, or scoped to a namespace/command",
        template: "\n{usage}\n{description}\n{namespaces}\n{commands}\n{options}\n",
      },
      version: {
        autoInclude: true,
        type: "boolean",
        aliases: ["v", "version"],
        description: "Display version",
        hidden: true,
      },
      rootCommand: true,
      cliName: "cli-app",
      cliVersion: "1.0.0",
      cliDescription: "cli-description",
      debug: false,
      completion: {
        enabled: true,
        command: "generate-completions",
      },
      configFile: undefined,
    });
  });
  it("CliOptions are the result of merging default and provided options when instantiating with options", () => {
    const overwrites = {
      baseLocation: "..",
      baseScriptLocation: "./",
      help: { autoInclude: false, aliases: ["help"], description: "", template: "template" },
      errors: { onExecuteCommand: [] },
      version: { aliases: ["version"], description: "", hidden: false },
      cliName: "custom-name",
      cliVersion: "2.0.0",
      cliDescription: "custom-description",
    };
    const c = new Cli({}, overwrites);
    expect(c.options).toStrictEqual({
      baseLocation: overwrites.baseScriptLocation,
      baseScriptLocation: overwrites.baseScriptLocation,
      commandsPath: "commands",
      errors: {
        onExecuteCommand: [],
        onGenerateHelp: ["command_not_found"],
      },
      help: {
        autoInclude: overwrites.help.autoInclude,
        type: "boolean",
        aliases: ["help"],
        description: "",
        template: "template",
      },
      version: {
        autoInclude: true,
        type: "boolean",
        aliases: ["version"],
        description: "",
        hidden: false,
      },
      rootCommand: true,
      cliName: "custom-name",
      cliVersion: "2.0.0",
      cliDescription: "custom-description",
      debug: false,
      completion: {
        enabled: true,
        command: "generate-completions",
      },
      configFile: undefined,
    });
  });
  it("Overwrite default logger", () => {
    const logger = jest.fn();
    const log = (...message: any[]) => logger("CUSTOMLOG ".concat(message.join(" ")));
    const error = (...message: any[]) => logger("CUSTOMERROR ".concat(message.join(" ")));
    new Cli({}, { logger: { log, error } });
    Cli.logger.log("some text");
    expect(logger).toHaveBeenCalledWith("CUSTOMLOG some text");
    Cli.logger.error("some text");
    expect(logger).toHaveBeenCalledWith("CUSTOMERROR some text");
  });
  it("Use name, version and description from package.json if not provided", () => {
    const cli = new Cli({});
    expect(cli.options).toMatchObject({
      cliName: "cli-app",
      cliVersion: "1.0.0",
      cliDescription: "cli-description",
    });
  });
  it("Use name, version and description from fallback if not provided and no package.json found", () => {
    jest.spyOn(utils, "findPackageJson").mockImplementation((_: any) => undefined);
    jest.spyOn(cliutils, "getEntryFile").mockImplementation(() => "script-name");
    const cli = new Cli({});
    expect(cli.options).toMatchObject({
      cliName: "script-name",
      cliVersion: "-",
      cliDescription: "",
    });
  });
});

describe("Cli.parse", () => {
  it("Parsing empty array results in default values from first-level options (with auto-included options)", () => {
    const c = new Cli(definition);
    const output = c.parse([]);
    expect(output).toStrictEqual({
      location: [],
      options: { globalOption: "globalvalue", _: [] },
      errors: [],
    });
  });
  it("Parsing empty array results in default values from first-level options (without auto-included options)", () => {
    const c = new Cli(definition, { help: { autoInclude: false }, version: { autoInclude: false } });
    const output = c.parse([]);
    expect(output).toStrictEqual({
      location: [],
      options: { globalOption: "globalvalue", _: [] },
      errors: [],
    });
  });
  it("Parsing boolean option supports negated aliases", () => {
    const c = new Cli(
      { opt: { type: "boolean", negatable: true } },
      { help: { autoInclude: false }, version: { autoInclude: false } },
    );
    expect(c.parse(["--noopt"]).options.opt).toBe(false);
    expect(c.parse(["--no-opt"]).options.opt).toBe(false);
    expect(c.parse(["--no-opt", "true"]).options.opt).toBe(false);
    expect(c.parse(["--no-opt", "false"]).options.opt).toBe(true);
  });
});

describe("Cli.run", () => {
  it("Calling run with arguments invokes the script in the computed location", () => {
    const spy = jest.spyOn(cliutils, "executeScript").mockImplementation();
    const c = new Cli(definition, { rootCommand: false });
    c.run(["nms", "cmd", "cmdvalue"]);
    expect(spy.mock.calls[0][0]).toStrictEqual({
      location: ["nms", "cmd"],
      options: { cmd: "cmdvalue", globalOption: "globalvalue", _: [] },
      errors: [],
    });
  });
  it("Calling run with arguments invokes the script in the computed location - options only", () => {
    const spy = jest.spyOn(cliutils, "executeScript").mockImplementation();
    const c = new Cli(definition);
    c.run(["--global", "overwritten"]);
    expect(spy.mock.calls[0][0]).toStrictEqual({
      location: [],
      options: { globalOption: "overwritten", _: [] },
      errors: [],
    });
  });
  it("Calling run with no namespace/command: CliOptions.rootCommand=false", () => {
    const spy = jest.spyOn(cliutils, "generateScopedHelp").mockImplementation();
    const c = new Cli(definition, { rootCommand: false });
    c.run([]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), [], expect.anything());
    spy.mockClear();
    c.run(["--global", "overwritten"]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), [], expect.anything());
  });
  it("Calling run with no namespace/command: typeof CliOptions.rootCommand=string", () => {
    const spy = jest.spyOn(cliutils, "executeScript").mockImplementation();
    const c = new Cli(definition, { rootCommand: "gcmd" });
    c.run([]);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ location: ["gcmd"] }), expect.anything());
    spy.mockClear();
  });
  it("Calling run on element with action invokes such action", () => {
    const action = jest.fn();
    const c = new Cli({
      cmd: {
        kind: "command",
        action,
      },
    });
    c.run(["cmd"]);
    expect(action).toHaveBeenCalled();
  });
  it("Calling run with help option invokes help-generation", () => {
    const spy = jest.spyOn(cliutils, "generateScopedHelp").mockImplementation();
    const c = new Cli(definition);
    c.run(["--help"]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), [], expect.anything());
    spy.mockClear();
    c.run(["--global", "overwritten", "--help"]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), [], expect.anything());
  });
  it("Calling run with help option invokes help-generation - wrong location", () => {
    const spy = jest.spyOn(cliutils, "generateScopedHelp").mockImplementation();
    const logger: any = { error: jest.fn() };
    const c = new Cli(definition, { logger });
    c.run(["nms", "unknown", "--help"]);
    // generateScopedHelped gets called with valid-location part
    expect(spy).toHaveBeenCalledWith(expect.anything(), ["nms"], expect.anything());
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/Command "\w+" not found. Did you mean "\w+" \?/),
      "\n",
    );
  });
  it("Calling run on namespaces invokes help-generation", () => {
    const spy = jest.spyOn(cliutils, "generateScopedHelp").mockImplementation();
    const c = new Cli(definition);
    c.run(["nms"]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), ["nms"], expect.anything());
  });
  it("Calling run with version option invokes version-formatting", () => {
    const spy = jest.spyOn(cliutils, "formatVersion").mockImplementation();
    const c = new Cli(definition);
    c.run(["--version"]);
    expect(spy).toHaveBeenCalledWith(expect.anything());
  });
  it("Calling run with version option invokes version-formatting - rootCommand:false", () => {
    const spy = jest.spyOn(cliutils, "formatVersion").mockImplementation();
    const c = new Cli(definition, { rootCommand: false });
    c.run(["--version"]);
    expect(spy).toHaveBeenCalledWith(expect.anything());
  });
  it("[onGenerateHelp] Prints error if configured", () => {
    const logger: any = { error: jest.fn() };
    jest.spyOn(CliError, "analize").mockImplementation(() => "command_not_found");
    jest
      .spyOn(cliutils, "parseArguments")
      .mockImplementation(() => ({ location: [], options: { help: true, _: [] }, errors: ["ERROR"] }));
    const c = new Cli(definition, { logger, errors: { onGenerateHelp: ["command_not_found"] } });
    c.run([]);
    expect(logger.error).toHaveBeenCalledWith("ERROR", "\n");
  });
  it("[onGenerateHelp] Does not print error if not configured", () => {
    const logger: any = { error: jest.fn() };
    jest.spyOn(CliError, "analize").mockImplementation(() => "command_not_found");
    jest
      .spyOn(cliutils, "parseArguments")
      .mockImplementation(() => ({ location: [], options: { help: true, _: [] }, errors: ["ERROR"] }));
    const c = new Cli(definition, { logger, errors: { onGenerateHelp: [] } });
    c.run([]);
    expect(logger.error).not.toHaveBeenCalled();
  });
  it("[onExecuteCommand] Prints error if configured", () => {
    jest.spyOn(CliError, "analize").mockImplementation(() => "command_not_found");
    jest
      .spyOn(cliutils, "parseArguments")
      .mockImplementation(() => ({ location: [], options: { _: [] }, errors: ["ERROR"] }));
    const errorlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
    const c = new Cli(definition, { errors: { onExecuteCommand: ["command_not_found"] } });
    c.run([]);
    expect(errorlogger).toHaveBeenCalledWith("ERROR");
  });
  it("[onExecuteCommand] Does not print error if not configured", () => {
    jest.spyOn(CliError, "analize").mockImplementation(() => "command_not_found");
    jest
      .spyOn(cliutils, "parseArguments")
      .mockImplementation(() => ({ location: [], options: { _: [] }, errors: ["ERROR"] }));
    const errorlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
    const c = new Cli(definition, { errors: { onExecuteCommand: [] } });
    c.run([]);
    expect(errorlogger).not.toHaveBeenCalled();
  });
  it("Errors are printed according to CliOptions.errors list order", () => {
    const logger: any = { error: jest.fn() };
    jest
      .spyOn(CliError, "analize")
      .mockImplementation(
        (value) => ({ CMD_NOT_FOUND: "command_not_found", OPT_NOT_FOUND: "option_not_found" }[value!] as ErrorType),
      );
    jest.spyOn(cliutils, "parseArguments").mockImplementation(() => ({
      location: [],
      options: { help: true, _: [] },
      errors: ["CMD_NOT_FOUND", "OPT_NOT_FOUND"],
    }));
    const c = new Cli(definition, { logger, errors: { onGenerateHelp: ["option_not_found", "command_not_found"] } });
    c.run([]);
    expect(logger.error).toHaveBeenCalledWith("OPT_NOT_FOUND", "\n");
  });
});

describe("Cli.configContent", () => {
  it("'configFile' not enabled - returns undefined", () => {
    const c = new Cli(definition);
    expect(c.configContent()).toBe(undefined);
    expect(utils.findFile).not.toHaveBeenCalled();
  });
  it("No file found - returns undefined", () => {
    (utils.findFile as jest.Mock).mockImplementation(() => undefined);
    const c = new Cli(definition, { configFile: { names: ["filename"] } });
    expect(c.configContent()).toBe(undefined);
    expect(utils.findFile).toHaveBeenCalled();
  });
  it("No parser provided, default to JSON", () => {
    (utils.findFile as jest.Mock).mockImplementation(() => "file");
    (fs.readFileSync as jest.Mock).mockImplementation(() => '{"content": "config"}');
    const c = new Cli(definition, { configFile: { names: ["filename"] } });
    expect(c.configContent()).toStrictEqual({ content: "config" });
  });
  it("Custom parser provided", () => {
    const mockParsedContent = { content: "parser-generated" };
    const parse = jest.fn(() => mockParsedContent);
    (utils.findFile as jest.Mock).mockImplementation(() => "file");
    (fs.readFileSync as jest.Mock).mockImplementation(() => "file-contents");
    const c = new Cli(definition, { configFile: { names: ["filename"], parse } });
    expect(c.configContent()).toStrictEqual(mockParsedContent);
    expect(parse).toHaveBeenCalledWith("file-contents", "file");
  });
});
