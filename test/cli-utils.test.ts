import {
  completeDefinition,
  parseArguments,
  executeScript,
  generateScopedHelp,
  getDefinitionElement,
  formatVersion,
} from "../src/cli-utils";
import Cli from "../src";
import * as utils from "../src/utils";
import definition from "./data/definition.json";
import readPackageUp from "read-pkg-up";
//@ts-ignore
import gcmd from "./data/gcmd";

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock("./data/gcmd", () => jest.fn());
jest.mock("path", () => ({ ...jest.requireActual("path"), extname: () => ".js" }));

describe("completeDefinition", () => {
  const definition = {
    nms: {
      kind: "namespace",
      description: "description for nms",
      options: {
        cmd: {
          kind: "command",
        },
      },
    },
    opt: {},
  };
  const cliOptions = {
    extension: "js",
    baseLocation: "",
    baseScriptLocation: "",
    commandsPath: "",
    onFail: {
      help: true,
      suggestion: true,
      scriptPaths: true,
    },
    help: {
      autoInclude: false,
      aliases: [],
      description: "",
      showOnFail: true,
    },
    version: {
      autoInclude: false,
      aliases: [],
      description: "",
    },
  };
  it("Completes missing fields in definition with nested content ", () => {
    const completedDefinition = completeDefinition(definition, cliOptions);
    expect(completedDefinition).toMatchObject({
      nms: {
        aliases: ["nms"],
        key: "nms",
        options: {
          cmd: {
            description: "-",
            aliases: ["cmd"],
            key: "cmd",
          },
        },
      },
      opt: { type: "string" },
    });
  });
  it("Includes help option if auto-include help is enabled", () => {
    const cliOptions_ = {
      ...cliOptions,
      help: {
        ...cliOptions.help,
        autoInclude: true,
        aliases: ["-h"],
      },
    };
    const completedDefinition = completeDefinition(definition, cliOptions_);
    expect(completedDefinition).toMatchObject({
      help: {
        type: "boolean",
        aliases: ["-h"],
        description: "",
      },
    });
  });
  it("Includes version option if auto-include version is enabled", () => {
    const cliOptions_ = {
      ...cliOptions,
      version: {
        ...cliOptions.version,
        autoInclude: true,
        aliases: ["-v"],
        description: "",
      },
    };
    const completedDefinition = completeDefinition(definition, cliOptions_);
    expect(completedDefinition).toMatchObject({
      version: {
        type: "boolean",
        aliases: ["-v"],
        description: "",
      },
    });
  });
});

describe("parseArguments", () => {
  //Get default options from Cli
  const { definition: def, options: cliOptions } = new Cli(definition, {
    help: { autoInclude: false },
    version: { autoInclude: false },
  });
  it("Parse BOOLEAN value", () => {
    const d = {
      opt: { type: "boolean", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "true"], d, cliOptions).options.opt).toBe(true);
    expect(parseArguments(["--opt"], d, cliOptions).options.opt).toBe(true);
    expect(parseArguments(["--opt", "false"], d, cliOptions).options.opt).toBe(false);
  });
  it("Parse LIST value", () => {
    const d = {
      opt: { type: "list", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "one,two"], d, cliOptions).options.opt).toStrictEqual(["one", "two"]);
  });
  it("Parse LIST value by repeated appearances", () => {
    const d = {
      opt: { type: "list", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "one,two", "--opt", "three"], d, cliOptions).options.opt).toStrictEqual([
      "one",
      "two",
      "three",
    ]);
  });
  it("Parse NUMBER value", () => {
    const d = {
      opt: { type: "number", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "1"], d, cliOptions).options.opt).toBe(1);
    expect(parseArguments(["--opt", "not-a-number"], d, cliOptions).options.opt).toBe(NaN);
    expect(parseArguments(["--opt"], d, cliOptions).options.opt).toBe(undefined);
  });
  it("No arguments", () => {
    //Get completed definition from Cli
    expect(parseArguments([], def, cliOptions)).toStrictEqual({
      location: [],
      options: { globalOption: "globalvalue" },
    });
  });
  it("Command with no type", () => {
    expect(parseArguments(["gcmd"], def, cliOptions)).toStrictEqual({
      location: [cliOptions.commandsPath, "gcmd"],
      options: { globalOption: "globalvalue" },
    });
  });
  it("Namespace + command", () => {
    //Get completed definition from Cli
    expect(parseArguments(["nms", "cmd"], def, cliOptions)).toStrictEqual({
      location: ["nms", "cmd"],
      options: { globalOption: "globalvalue", cmd: undefined, opt: undefined },
    });
    expect(parseArguments(["nms", "cmd", "cmdValue"], def, cliOptions)).toStrictEqual({
      location: ["nms", "cmd"],
      options: { globalOption: "globalvalue", cmd: "cmdValue", opt: undefined },
    });
  });
  it("Returns error if wrong namespace/command provided", () => {
    expect(parseArguments(["nms", "non-existent"], def, cliOptions)).toStrictEqual({
      options: expect.anything(),
      location: expect.anything(),
      error: expect.stringContaining('Command "non-existent" not found. Did you mean "cmd" ?'),
    });
  });
});

describe("executeScript", () => {
  const cliOptions = new Cli({}).options;
  it("Logs error if no baseScriptLocation configured", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error").mockImplementation();
    executeScript({ location: [], options: {} }, { ...cliOptions, baseScriptLocation: "" }, {});
    expect(errorlogger).toHaveBeenCalledWith("There was a problem finding base script location");
  });
  it("No valid script found: logs error (onFail.help=false, onFail.scriptPaths=false)", () => {
    const cliOptions_ = { ...cliOptions, onFail: { ...cliOptions.onFail, help: false, scriptPaths: false } };
    const rawlogger = jest.spyOn(utils.Logger, "raw").mockImplementation(() => true);
    executeScript({ location: ["non-existent"], options: {} }, cliOptions_, {});
    expect(rawlogger).not.toHaveBeenCalledWith(expect.stringContaining("Options:"));
    expect(rawlogger).toHaveBeenCalledWith("There was a problem finding the script to run.");
    expect(rawlogger).not.toHaveBeenCalledWith(" Considered paths were:\n");
  });
  it("No valid script found: prints help + logs error (onFail.help=true, onFail.scriptPaths=false)", () => {
    const cliOptions_ = { ...cliOptions, onFail: { ...cliOptions.onFail, scriptPaths: false } };
    const rawlogger = jest.spyOn(utils.Logger, "raw").mockImplementation(() => true);
    executeScript({ location: ["non-existent"], options: {} }, cliOptions_, { opt: { description: "description" } });
    expect(rawlogger).toHaveBeenCalledWith(expect.stringContaining("Options:"));
    expect(rawlogger).toHaveBeenCalledWith(expect.stringContaining("There was a problem finding the script to run."));
    expect(rawlogger).not.toHaveBeenCalledWith(" Considered paths were:\n");
  });
  it("No valid script found: prints help + logs error + prints paths (onFail.help=true, onFail.scriptPaths=true)", () => {
    const rawlogger = jest.spyOn(utils.Logger, "raw").mockImplementation(() => true);
    executeScript({ location: ["non-existent"], options: {} }, cliOptions, { opt: { description: "description" } });
    expect(rawlogger).toHaveBeenCalledWith(expect.stringContaining("Options:"));
    expect(rawlogger).toHaveBeenCalledWith(expect.stringContaining("There was a problem finding the script to run."));
    expect(rawlogger).toHaveBeenCalledWith(" Considered paths were:\n");
  });
  it("Script execution fails: logs error", () => {
    (gcmd as any).mockImplementation(() => {
      throw new Error();
    });
    const errorlogger = jest.spyOn(utils.Logger, "error").mockImplementation();
    executeScript({ location: ["data", "gcmd"], options: {} }, cliOptions, {});
    expect(errorlogger).toHaveBeenCalledWith(expect.stringContaining("There was a problem executing the script"));
  });
  it("Executes script if found", () => {
    (gcmd as any).mockImplementation();
    const errorlogger = jest.spyOn(utils.Logger, "error").mockImplementation();
    executeScript({ location: ["data", "gcmd"], options: { gcmd: "gcmdvalue" } }, cliOptions, {});
    expect(gcmd).toHaveBeenCalledWith({ gcmd: "gcmdvalue" });
    expect(errorlogger).not.toHaveBeenCalled();
  });
});

describe("generateScopedHelp", () => {
  const cliOptions = new Cli({}).options;
  const rawlogger = jest.spyOn(utils.Logger, "raw").mockImplementation(() => true);
  const d = new Cli(definition).definition;
  it("With empty location (first level definition)", () => {
    let output = "";
    rawlogger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(d, [], cliOptions);
    expect(output).toBe(`
Usage:  cli-er NAMESPACE|COMMAND [OPTIONS]

Namespaces:
  nms            Description for the namespace

Commands:
  gcmd           Description for global command

Options:
  -g, --global   Option shared between all commands (default: globalvalue)
  -h, --help     Display global help, or scoped to a namespace/command
  -v, --version  Display version

`);
  });
  it("With location", () => {
    let output = "";
    rawlogger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(definition, ["nms"], cliOptions);
    expect(output).toBe(`
Usage:  cli-er nms COMMAND

Description for the namespace

Commands:
  cmd  Description for the command

`);
  });
  it.only("With location: resulting element has no options", () => {
    let output = "";
    rawlogger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp({ cmd: { kind: "command", description: "Command with no options" } }, ["cmd"], cliOptions);
    expect(output).toBe(`
Usage:  cli-er cmd

Command with no options

`);
  });
});

describe("getDefinitionElement", () => {
  const cliOptions = new Cli({}).options;
  it("Returns the original definition when provided with empty location array", () => {
    expect(getDefinitionElement(definition, [], cliOptions)).toStrictEqual(definition);
  });
  it("Returns the scoped definition", () => {
    expect(getDefinitionElement(definition, ["nms"], cliOptions)).toStrictEqual({
      description: "Description for the namespace",
      kind: "namespace",
      options: {
        cmd: {
          description: "Description for the command",
          kind: "command",
          type: "string",
          options: {
            opt: {
              type: "boolean",
            },
          },
        },
      },
    });
  });
  it("Does not take into account commandPath when encountered", () => {
    expect(getDefinitionElement(definition, ["commands", "gcmd"], cliOptions)).toStrictEqual({
      description: "Description for global command",
      kind: "command",
    });
  });
});

describe("formatVersion", () => {
  const cliOptions = new Cli({}).options;
  it("No baseLocation: prints error", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error").mockImplementation();
    formatVersion({ ...cliOptions, baseLocation: undefined });
    expect(errorlogger).toHaveBeenCalledWith(expect.stringContaining("Unable to find base location"));
  });
  it("No package.json: prints error", () => {
    jest.spyOn(readPackageUp, "sync").mockImplementation(() => undefined);
    const errorlogger = jest.spyOn(utils.Logger, "error").mockImplementation();
    formatVersion(cliOptions);
    expect(errorlogger).toHaveBeenCalledWith("Error reading package.json file");
  });
  it("Finds package.json: prints formatted version", () => {
    const logger = jest.spyOn(utils.Logger, "log").mockImplementation();
    jest.spyOn(readPackageUp, "sync").mockImplementation(() => ({
      packageJson: { version: "1.0.0", name: "cli-app" },
      path: "",
    }));
    formatVersion(cliOptions);
    expect(logger).toHaveBeenCalledWith("  cli-app version: 1.0.0");
  });
});
