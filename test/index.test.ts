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
jest.spyOn(cliutils, "getEntryPoint").mockImplementation(() => "/require.main.filename");
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
      baseLocation: "/require.main.filename",
      baseScriptLocation: "/require.main.filename",
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
      hooks: {},
      debug: false,
      completion: {
        enabled: true,
        command: "generate-completions",
      },
      configFile: undefined,
      envPrefix: undefined,
    });
  });
  it("CliOptions are the result of merging default and provided options when instantiating with options", () => {
    const overwrites = {
      baseLocation: "./",
      baseScriptLocation: "base-location",
      commandsPath: "/require.main.filename/base-location",
      help: { autoInclude: false, aliases: ["help"], description: "", template: "template" },
      errors: { onExecuteCommand: [] },
      version: { aliases: ["version"], description: "", hidden: false },
      cliName: "custom-name",
      cliVersion: "2.0.0",
      cliDescription: "custom-description",
    };
    const c = new Cli({}, overwrites);
    expect(c.options).toStrictEqual({
      baseLocation: "/require.main.filename/base-location",
      baseScriptLocation: overwrites.baseScriptLocation,
      commandsPath: ".",
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
      hooks: {},
      debug: false,
      completion: {
        enabled: true,
        command: "generate-completions",
      },
      configFile: undefined,
      envPrefix: undefined,
    });
  });
  it("CliOptions - transform baseLocation into absolute path", () => {
    const options = { baseLocation: "base-location" };
    const c = new Cli({}, options);
    expect(c.options.baseLocation).toBe("/require.main.filename/".concat(options.baseLocation));
  });
  it("CliOptions - transform commandsPath into a relative path to baseLocation", () => {
    const options = { baseLocation: "base-location", commandsPath: "/require.main.filename/base-location/cmds-path" };
    const c = new Cli({}, options);
    expect(c.options.commandsPath).toBe("cmds-path");
  });
  it("[deprecated] CliOptions - baseLocation inherits from baseScriptLocation when provided", () => {
    const dpwMock = jest.spyOn(utils, "deprecationWarning").mockImplementation((_: any) => {});
    const options = { baseLocation: "base-location", baseScriptLocation: "base-script-location" };
    const c = new Cli({}, options);
    expect(c.options.baseLocation).toBe("/require.main.filename/".concat(options.baseScriptLocation));
    expect(dpwMock).toHaveBeenCalledWith({
      property: "CliOptions.baseScriptLocation",
      alternative: "CliOptions.baseLocation",
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
  it("Calling run with arguments invokes the script in the computed location", async () => {
    const spy = jest.spyOn(cliutils, "executeScript").mockImplementation();
    const c = new Cli(definition, { rootCommand: false });
    await c.run(["nms", "cmd", "cmdvalue"]);
    expect(spy.mock.calls[0][0]).toStrictEqual({
      location: ["nms", "cmd"],
      options: { cmd: "cmdvalue", globalOption: "globalvalue", _: [] },
      errors: [],
    });
  });
  it("Calling run with arguments invokes the script in the computed location - options only", async () => {
    const spy = jest.spyOn(cliutils, "executeScript").mockImplementation();
    const c = new Cli(definition);
    await c.run(["--global", "overwritten"]);
    expect(spy.mock.calls[0][0]).toStrictEqual({
      location: [],
      options: { globalOption: "overwritten", _: [] },
      errors: [],
    });
  });
  it("Calling run with no namespace/command: CliOptions.rootCommand=false", async () => {
    const spy = jest.spyOn(cliutils, "generateScopedHelp").mockImplementation();
    const c = new Cli(definition, { rootCommand: false });
    await c.run([]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), [], expect.anything());
    spy.mockClear();
    await c.run(["--global", "overwritten"]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), [], expect.anything());
  });
  it("Calling run with no namespace/command: typeof CliOptions.rootCommand=string", async () => {
    const spy = jest.spyOn(cliutils, "executeScript").mockImplementation();
    const c = new Cli(definition, { rootCommand: "gcmd" });
    await c.run([]);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ location: ["gcmd"] }), expect.anything());
    spy.mockClear();
  });
  it("Calling run on element with action invokes such action", async () => {
    const action = jest.fn();
    const c = new Cli({
      cmd: {
        kind: "command",
        action,
      },
    });
    await c.run(["cmd"]);
    expect(action).toHaveBeenCalled();
  });
  it("async-action - await and capture error", async () => {
    const action = jest.fn(async () => {
      throw new Error("error-message");
    });
    const errorlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
    const c = new Cli({
      cmd: {
        kind: "command",
        action,
      },
    });
    await c.run(["cmd"]);
    expect(action).toHaveBeenCalled();
    expect(errorlogger).toHaveBeenCalledWith("error-message");
  });
  it("Calling run with help option invokes help-generation", async () => {
    const spy = jest.spyOn(cliutils, "generateScopedHelp").mockImplementation();
    const c = new Cli(definition);
    await c.run(["--help"]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), [], expect.anything());
    spy.mockClear();
    await c.run(["--global", "overwritten", "--help"]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), [], expect.anything());
  });
  it("Calling run with help option invokes help-generation - wrong location", async () => {
    const spy = jest.spyOn(cliutils, "generateScopedHelp").mockImplementation();
    const logger: any = { error: jest.fn() };
    const c = new Cli(definition, { logger });
    await c.run(["nms", "unknown", "--help"]);
    // generateScopedHelped gets called with valid-location part
    expect(spy).toHaveBeenCalledWith(expect.anything(), ["nms"], expect.anything());
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/Command "\w+" not found. Did you mean "\w+" \?/),
      "\n",
    );
  });
  it("Calling run on namespaces invokes help-generation", async () => {
    const spy = jest.spyOn(cliutils, "generateScopedHelp").mockImplementation();
    const c = new Cli(definition);
    await c.run(["nms"]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), ["nms"], expect.anything());
  });
  it("Calling run on namespace with help option invokes help-generation - default-command", async () => {
    const spy = jest.spyOn(cliutils, "generateScopedHelp").mockImplementation();
    const c = new Cli({ nms: { kind: "namespace", default: "cmd", options: { cmd: { kind: "command" } } } });
    await c.run(["nms", "-h"]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), ["nms"], expect.anything());
  });
  it("Calling run with version option invokes version-formatting", async () => {
    const spy = jest.spyOn(cliutils, "formatVersion").mockImplementation();
    const c = new Cli(definition);
    await c.run(["--version"]);
    expect(spy).toHaveBeenCalledWith(expect.anything());
  });
  it("Calling run with version option invokes version-formatting - rootCommand:false", async () => {
    const spy = jest.spyOn(cliutils, "formatVersion").mockImplementation();
    const c = new Cli(definition, { rootCommand: false });
    await c.run(["--version"]);
    expect(spy).toHaveBeenCalledWith(expect.anything());
  });
  it("[onGenerateHelp] Prints error if configured", async () => {
    const logger: any = { error: jest.fn() };
    jest.spyOn(CliError, "analize").mockImplementation(() => "command_not_found");
    jest.spyOn(cliutils, "parseArguments").mockImplementationOnce(() => ({
      location: [],
      options: { help: true, _: [] },
      errors: ["ERROR"],
      rawLocation: [],
    }));
    const c = new Cli(definition, { logger, errors: { onGenerateHelp: ["command_not_found"] } });
    await c.run([]);
    expect(logger.error).toHaveBeenCalledWith("ERROR", "\n");
  });
  it("[onGenerateHelp] Does not print error if not configured", async () => {
    const logger: any = { error: jest.fn() };
    jest.spyOn(CliError, "analize").mockImplementation(() => "command_not_found");
    jest.spyOn(cliutils, "parseArguments").mockImplementationOnce(() => ({
      location: [],
      options: { help: true, _: [] },
      errors: ["ERROR"],
      rawLocation: [],
    }));
    const c = new Cli(definition, { logger, errors: { onGenerateHelp: [] } });
    await c.run([]);
    expect(logger.error).not.toHaveBeenCalled();
  });
  it("[onExecuteCommand] Prints error if configured", async () => {
    jest.spyOn(CliError, "analize").mockImplementation(() => "command_not_found");
    jest
      .spyOn(cliutils, "parseArguments")
      .mockImplementationOnce(() => ({ location: [], options: { _: [] }, errors: ["ERROR"], rawLocation: [] }));
    const errorlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
    const c = new Cli(definition, { errors: { onExecuteCommand: ["command_not_found"] } });
    await c.run([]);
    expect(errorlogger).toHaveBeenCalledWith("ERROR");
  });
  it("[onExecuteCommand] Does not print error if not configured", async () => {
    jest.spyOn(CliError, "analize").mockImplementation(() => "command_not_found");
    jest
      .spyOn(cliutils, "parseArguments")
      .mockImplementationOnce(() => ({ location: [], options: { _: [] }, errors: ["ERROR"], rawLocation: [] }));
    const errorlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
    const c = new Cli(definition, { errors: { onExecuteCommand: [] } });
    await c.run([]);
    expect(errorlogger).not.toHaveBeenCalled();
  });
  it("Errors are printed according to CliOptions.errors list order", async () => {
    const logger: any = { error: jest.fn() };
    jest
      .spyOn(CliError, "analize")
      .mockImplementation(
        (value) => ({ CMD_NOT_FOUND: "command_not_found", OPT_NOT_FOUND: "option_not_found" }[value!] as ErrorType),
      );
    jest.spyOn(cliutils, "parseArguments").mockImplementationOnce(() => ({
      location: [],
      options: { help: true, _: [] },
      errors: ["CMD_NOT_FOUND", "OPT_NOT_FOUND"],
      rawLocation: [],
    }));
    const c = new Cli(definition, { logger, errors: { onGenerateHelp: ["option_not_found", "command_not_found"] } });
    await c.run([]);
    expect(logger.error).toHaveBeenCalledWith("OPT_NOT_FOUND", "\n");
  });
  it("Inital value is computed from configuration-content and env-content", async () => {
    (utils.findFile as jest.Mock).mockImplementation(() => "file");
    (fs.readFileSync as jest.Mock).mockImplementation(() => '{"key1": "value1", "key2": "value2"}');
    process.env.CLIERTEST_KEY2 = "env2";
    process.env.CLIERTEST_KEY3 = "env3";
    const mock = jest.spyOn(cliutils, "parseArguments").mockImplementationOnce(() => ({
      location: [],
      options: { _: [] },
      errors: [],
      rawLocation: [],
    }));
    const c = new Cli(definition, { configFile: { names: ["file"] }, envPrefix: "CLIERTEST_" });
    await c.run([]);
    expect(mock).toHaveBeenCalledWith(
      expect.objectContaining({ initial: { key1: "value1", key2: "env2", key3: "env3" } }),
    );
  });
});

describe("Cli.run > hooks", () => {
  it("afterParse", async () => {
    const afterParse = jest.fn(async () => {});
    const action = jest.fn();
    const c = new Cli({ cmd: { kind: "command", action } }, { hooks: { afterParse } });
    await c.run(["cmd"]);
    expect(afterParse).toHaveBeenCalledWith({
      errors: [],
      location: ["cmd"],
      options: {
        _: [],
      },
    });
    expect(afterParse.mock.invocationCallOrder[0]).toBeLessThan(action.mock.invocationCallOrder[0]);
  });
  it("beforeExecute", async () => {
    const beforeExecute = jest.fn(async () => {});
    const action = jest.fn(async () => {});
    const c = new Cli({ cmd: { kind: "command", action } }, { hooks: { beforeExecute } });
    await c.run(["cmd"]);
    const po = { errors: [], location: ["cmd"], options: { _: [] } };
    expect(beforeExecute).toHaveBeenCalledWith(po);
    expect(action).toHaveBeenCalledWith(po, expect.anything());
    expect(beforeExecute.mock.invocationCallOrder[0]).toBeLessThan(action.mock.invocationCallOrder[0]);
  });
  it("afterExecute", async () => {
    const afterExecute = jest.fn(async () => {});
    const action = jest.fn(async () => {});
    const c = new Cli({ cmd: { kind: "command", action } }, { hooks: { afterExecute } });
    await c.run(["cmd"]);
    const po = { errors: [], location: ["cmd"], options: { _: [] } };
    expect(afterExecute).toHaveBeenCalledWith(po);
    expect(action).toHaveBeenCalledWith(po, expect.anything());
    expect(action.mock.invocationCallOrder[0]).toBeLessThan(afterExecute.mock.invocationCallOrder[0]);
  });
  it("afterExecute - action-error", async () => {
    const afterExecute = jest.fn(async () => {});
    const error = new Error("error-message");
    const action = jest.fn(async () => {
      throw error;
    });
    const c = new Cli({ cmd: { kind: "command", action } }, { hooks: { afterExecute } });
    await c.run(["cmd"]);
    const po = { errors: [], location: ["cmd"], options: { _: [] } };
    expect(afterExecute).toHaveBeenCalledWith({ ...po, error });
    expect(action).toHaveBeenCalledWith(po, expect.anything());
    expect(action.mock.invocationCallOrder[0]).toBeLessThan(afterExecute.mock.invocationCallOrder[0]);
  });
  it("afterExecute throws error - action-error", async () => {
    const afterExecute = jest.fn(async () => {
      throw new Error();
    });
    const error = new Error("error-message");
    const action = jest.fn(async () => {
      throw error;
    });
    const c = new Cli({ cmd: { kind: "command", action } }, { hooks: { afterExecute } });
    await c.run(["cmd"]);
    const po = { errors: [], location: ["cmd"], options: { _: [] } };
    expect(afterExecute).toHaveBeenCalledTimes(1);
    expect(afterExecute).toHaveBeenCalledWith({ ...po, error });
    expect(action).toHaveBeenCalledWith(po, expect.anything());
    expect(action.mock.invocationCallOrder[0]).toBeLessThan(afterExecute.mock.invocationCallOrder[0]);
  });
  it("beforeExecute throws error - afterExecutes gets called", async () => {
    const error = new Error("error-message");
    const beforeExecute = jest.fn(async () => {
      throw error;
    });
    const afterExecute = jest.fn();
    const action = jest.fn();
    const c = new Cli({ cmd: { kind: "command", action } }, { hooks: { beforeExecute, afterExecute } });
    await c.run(["cmd"]);
    const po = { errors: [], location: ["cmd"], options: { _: [] } };
    expect(beforeExecute).toHaveBeenCalledWith(po);
    expect(action).not.toHaveBeenCalled();
    expect(afterExecute).toHaveBeenCalledWith({ ...po, error });
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

describe("Cli.envContent", () => {
  it("envPrefix not defined - returns undefined", () => {
    const c = new Cli(definition);
    expect(c.envContent()).toBe(undefined);
  });
  it("envPrefix defined - extracts options from process.env", () => {
    process.env.CLIERTEST2_VALUE1 = "v1-value";
    process.env.CLIERTEST2_VALUE3 = "v3-value";
    const c = new Cli(definition, { envPrefix: "CLIERTEST2_" });
    expect(c.envContent()).toStrictEqual({ value1: "v1-value", value3: "v3-value" });
  });
});
