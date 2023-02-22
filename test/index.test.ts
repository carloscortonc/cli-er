import Cli from "../src/index";
import * as cliutils from "../src/cli-utils";
import * as utils from "../src/utils";
import definition from "./data/definition.json";
import { CliError, ErrorType } from "../src/cli-errors";

jest.spyOn(cliutils, "getEntryPoint").mockImplementation(() => "require.main.filename");
jest.spyOn(cliutils, "findPackageJson").mockImplementation(
  (_: any) =>
    ({
      version: "1.0.0",
      name: "cli-app",
      description: "cli-description",
    } as any)
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Cli.constructor", () => {
  it("Resulting definition contains only auto-included options when provided with empty definition", () => {
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
    });
  });
  it("Resulting definition is an empty object when provided with empty definition and all auto-included options are disabled", () => {
    const c = new Cli({}, { help: { autoInclude: false }, version: { autoInclude: false } });
    expect(c.definition).toStrictEqual({});
  });
  it("CliOptions are default when instantiating with no options", () => {
    const c = new Cli({});
    expect(c.options).toStrictEqual({
      baseLocation: "require.main.filename",
      baseScriptLocation: "require.main.filename",
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
      cliName: "cli-app",
      cliVersion: "1.0.0",
      cliDescription: "cli-description",
    });
  });
  it("CliOptions are the result of merging default and provided options when instantiating with options", () => {
    const overrides = {
      baseLocation: "..",
      baseScriptLocation: "./",
      help: { autoInclude: false, aliases: ["--help"], description: "", template: "template" },
      version: { aliases: ["--version"], description: "" },
      onFail: { suggestion: false },
      cliName: "custom-name",
      cliVersion: "2.0.0",
      cliDescription: "custom-description",
    };
    const c = new Cli({}, overrides);
    expect(c.options).toStrictEqual({
      baseLocation: overrides.baseLocation,
      baseScriptLocation: overrides.baseScriptLocation,
      commandsPath: "commands",
      onFail: {
        help: true,
        suggestion: false,
        scriptPaths: true,
        stopOnUnknownOption: true,
      },
      help: {
        autoInclude: overrides.help.autoInclude,
        aliases: ["--help"],
        description: "",
        template: "template",
      },
      version: {
        autoInclude: true,
        aliases: ["--version"],
        description: "",
      },
      rootCommand: true,
      cliName: "custom-name",
      cliVersion: "2.0.0",
      cliDescription: "custom-description",
    });
  });
  it("Override default logger", () => {
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
    jest.spyOn(cliutils, "findPackageJson").mockImplementation((_: any) => undefined);
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
      options: { globalOption: "globalvalue", help: undefined, version: undefined },
    });
  });
  it("Parsing empty array results in default values from first-level options (without auto-included options)", () => {
    const c = new Cli(definition, { help: { autoInclude: false }, version: { autoInclude: false } });
    const output = c.parse([]);
    expect(output).toStrictEqual({
      location: [],
      options: { globalOption: "globalvalue" },
    });
  });
});

describe("Cli.run", () => {
  it("Calling run with arguments invokes the script in the computed location", () => {
    const spy = jest.spyOn(cliutils, "executeScript").mockImplementation();
    const c = new Cli(definition, { rootCommand: false });
    c.run(["nms", "cmd", "cmdvalue"]);
    expect(spy.mock.calls[0][0]).toStrictEqual({
      location: ["nms", "cmd"],
      options: { cmd: "cmdvalue", globalOption: "globalvalue", opt: undefined },
    });
  });
  it("Calling run with arguments invokes the script in the computed location - options only", () => {
    const spy = jest.spyOn(cliutils, "executeScript").mockImplementation();
    const c = new Cli(definition);
    c.run(["--global", "overridden"]);
    expect(spy.mock.calls[0][0]).toStrictEqual({
      location: [],
      options: { globalOption: "overridden" },
    });
  });
  it("Calling run with no namespace/command: CliOptions.rootCommand=false", () => {
    const spy = jest.spyOn(cliutils, "generateScopedHelp").mockImplementation();
    const c = new Cli(definition, { rootCommand: false });
    c.run([]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), [], expect.anything());
    spy.mockClear();
    c.run(["--global", "overridden"]);
    expect(spy).toHaveBeenCalledWith(expect.anything(), [], expect.anything());
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
    c.run(["--global", "overridden", "--help"]);
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
      "\n"
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
  it("Prints command-not-found error if configured", () => {
    jest.spyOn(CliError, "analize").mockImplementation(() => ErrorType.COMMAND_NOT_FOUND);
    jest.spyOn(cliutils, "parseArguments").mockImplementation(() => ({ location: [], options: {}, error: "ERROR" }));
    const errorlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
    const c = new Cli(definition);
    c.run([]);
    expect(errorlogger).toHaveBeenCalledWith("ERROR");
  });
  it("Prints option-not-found error if configured", () => {
    jest.spyOn(CliError, "analize").mockImplementation(() => ErrorType.OPTION_NOT_FOUND);
    jest.spyOn(cliutils, "parseArguments").mockImplementation(() => ({ location: [], options: {}, error: "ERROR" }));
    const errorlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
    const c = new Cli(definition);
    c.run([]);
    expect(errorlogger).toHaveBeenCalledWith("ERROR");
  });
  it("Prints option-wrong-value error if configured", () => {
    jest.spyOn(CliError, "analize").mockImplementation(() => ErrorType.OPTION_WRONG_VALUE);
    jest.spyOn(cliutils, "parseArguments").mockImplementation(() => ({ location: [], options: {}, error: "ERROR" }));
    const errorlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
    const c = new Cli(definition);
    c.run([]);
    expect(errorlogger).toHaveBeenCalledWith("ERROR");
  });
  it("Prints missing-option-value error of configured", () => {
    jest.spyOn(CliError, "analize").mockImplementation(() => ErrorType.OPTION_MISSING_VALUE);
    jest.spyOn(cliutils, "parseArguments").mockImplementation(() => ({ location: [], options: {}, error: "ERROR" }));
    const errorlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
    const c = new Cli(definition);
    c.run([]);
    expect(errorlogger).toHaveBeenCalledWith("ERROR");
  });
});
