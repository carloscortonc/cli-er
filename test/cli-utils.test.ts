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
//@ts-ignore
import gcmd from "./data/gcmd";
import { OptionValue, ParsingOutput } from "../src/types";

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock("./data/gcmd", () => jest.fn());
jest.mock("path", () => ({ ...jest.requireActual("path"), parse: () => ({ name: "script", ext: ".js" }) }));
jest.spyOn(process, "exit").mockImplementation();

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
    baseLocation: "",
    baseScriptLocation: "",
    commandsPath: "",
    onFail: {
      help: true,
      suggestion: true,
      scriptPaths: true,
      stopOnUnknownOption: true,
    },
    help: {
      autoInclude: false,
      aliases: [],
      description: "",
    },
    version: {
      autoInclude: false,
      aliases: [],
      description: "",
    },
    cliName: "",
    cliVersion: "",
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
      opt: { kind: "option", type: "boolean", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "true"], d, cliOptions).options.opt).toBe(true);
    expect(parseArguments(["--opt"], d, cliOptions).options.opt).toBe(true);
    expect(parseArguments(["--opt", "false"], d, cliOptions).options.opt).toBe(false);
  });
  it("Parse LIST value", () => {
    const d = {
      opt: { kind: "option", type: "list", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "one,two"], d, cliOptions).options.opt).toStrictEqual(["one", "two"]);
  });
  it("Parse LIST value by repeated appearances", () => {
    const d = {
      opt: { kind: "option", type: "list", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "one,two", "--opt", "three"], d, cliOptions).options.opt).toStrictEqual([
      "one",
      "two",
      "three",
    ]);
  });
  it("Parse NUMBER value", () => {
    const d = {
      opt: { kind: "option", type: "number", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "1"], d, cliOptions).options.opt).toBe(1);
    expect(parseArguments(["--opt", "not-a-number"], d, cliOptions)).toStrictEqual({
      options: { opt: undefined },
      error: 'Wrong value for option "--opt". Expected <number> but found "not-a-number"',
      location: expect.anything(),
    });
    expect(parseArguments(["--opt"], d, cliOptions).options.opt).toBe(undefined);
  });
  it("Parse FLOAT value", () => {
    const d = {
      opt: { kind: "option", type: "float", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "1.5"], d, cliOptions).options.opt).toBe(1.5);
    expect(parseArguments(["--opt", "not-a-number"], d, cliOptions)).toStrictEqual({
      options: { opt: undefined },
      error: 'Wrong value for option "--opt". Expected <float> but found "not-a-number"',
      location: expect.anything(),
    });
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
  it("Option with value property", () => {
    const d = new Cli({
      test: {
        default: "testvalue",
      },
      opt: {
        value: (v: OptionValue, o: ParsingOutput["options"]) => {
          // Attempt to modify options directly
          delete o.test;
          return (v as string).concat("-edited");
        },
      },
    }).definition;
    expect(parseArguments(["--opt", "optvalue"], d, cliOptions)).toStrictEqual({
      options: { opt: "optvalue-edited", test: "testvalue", version: undefined, help: undefined },
      location: expect.anything(),
    });
  });
  it("Returns error if wrong namespace/command provided", () => {
    expect(parseArguments(["nms", "non-existent"], def, cliOptions)).toStrictEqual({
      options: expect.anything(),
      location: expect.anything(),
      error: expect.stringContaining('Command "non-existent" not found. Did you mean "cmd" ?'),
    });
  });
  it("Returns error if unknown options are found", () => {
    expect(parseArguments(["nms", "cmd", "cmdvalue", "unknown-option"], def, cliOptions)).toStrictEqual({
      options: expect.anything(),
      location: expect.anything(),
      error: 'Unknown option "unknown-option"',
    });
  });
  it("Returns error if option has incorrect value", () => {
    expect(parseArguments(["nms", "cmd", "cmdvalue", "--opt", "true"], def, cliOptions)).toStrictEqual({
      options: expect.anything(),
      location: expect.anything(),
      error: 'Wrong value for option "--opt". Expected <number> but found "true"',
    });
  });
});

describe("executeScript", () => {
  const cliOptions = new Cli({}).options;
  const logger = jest.spyOn(Cli.logger, "log").mockImplementation();
  const exitlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
  const d = new Cli({ opt: { description: "description" } }).definition;
  it("Logs error if no baseScriptLocation configured", () => {
    executeScript({ location: [], options: {} }, { ...cliOptions, baseScriptLocation: "" }, d);
    expect(exitlogger).toHaveBeenCalledWith("There was a problem finding base script location");
  });
  it("No valid script found: logs error (onFail.help=false, onFail.scriptPaths=false)", () => {
    const cliOptions_ = { ...cliOptions, onFail: { ...cliOptions.onFail, help: false, scriptPaths: false } };
    executeScript({ location: ["non-existent"], options: {} }, cliOptions_, d);
    expect(logger).not.toHaveBeenCalledWith(expect.stringContaining("Options:"));
    expect(exitlogger).toHaveBeenCalledWith(expect.stringContaining("There was a problem finding the script to run."));
    expect(exitlogger).not.toHaveBeenCalledWith(expect.stringContaining(" Considered paths were:\n"));
  });
  it("No valid script found: prints help + logs error (onFail.help=true, onFail.scriptPaths=false)", () => {
    const cliOptions_ = { ...cliOptions, onFail: { ...cliOptions.onFail, scriptPaths: false } };
    executeScript({ location: ["non-existent"], options: {} }, cliOptions_, d);
    expect(logger).toHaveBeenCalledWith(expect.stringContaining("Options:"));
    expect(exitlogger).toHaveBeenCalledWith(expect.stringContaining("There was a problem finding the script to run."));
    expect(exitlogger).not.toHaveBeenCalledWith(expect.stringContaining(" Considered paths were:\n"));
  });
  it("No valid script found: prints help + logs error + prints paths (onFail.help=true, onFail.scriptPaths=true)", () => {
    executeScript({ location: ["non-existent"], options: {} }, cliOptions, d);
    expect(logger).toHaveBeenCalledWith(expect.stringContaining("Options:"));
    expect(exitlogger).toHaveBeenCalledWith(expect.stringContaining("There was a problem finding the script to run."));
    expect(exitlogger).toHaveBeenCalledWith(expect.stringContaining(" Considered paths were:\n"));
  });
  it("Script execution fails: logs error", () => {
    (gcmd as any).mockImplementation(() => {
      throw new Error("errormessage");
    });
    executeScript({ location: ["data", "gcmd"], options: {} }, cliOptions, d);
    expect(exitlogger).toHaveBeenCalledWith(
      expect.stringMatching("There was a problem executing the script (.+: errormessage)")
    );
  });
  it("Executes script if found", () => {
    (gcmd as any).mockImplementation();
    executeScript({ location: ["data", "gcmd"], options: { gcmd: "gcmdvalue" } }, cliOptions, d);
    expect(gcmd).toHaveBeenCalledWith({ gcmd: "gcmdvalue" });
    expect(exitlogger).not.toHaveBeenCalled();
  });
});

describe("generateScopedHelp", () => {
  const cliOptions = new Cli({}).options;
  const logger = jest.spyOn(Cli.logger, "log").mockImplementation();
  const d = new Cli(definition).definition;
  it("With empty location (first level definition)", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(d, [], cliOptions);
    expect(output).toBe(`
Usage:  cli-er NAMESPACE|COMMAND [OPTIONS]

Namespaces:
  nms           Description for the namespace

Commands:
  gcmd          Description for global command

Options:
  -g, --global  Option shared between all commands (default: globalvalue)
  -h, --help    Display global help, or scoped to a namespace/command

`);
  });
  it("With location", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(d, ["nms"], cliOptions);
    expect(output).toBe(`
Usage:  cli-er nms COMMAND

Description for the namespace

Commands:
  cmd  Description for the command

`);
  });
  it("With location: resulting element has no options", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp({ cmd: { kind: "command", description: "Command with no options" } }, ["cmd"], cliOptions);
    expect(output).toBe(`
Usage:  cli-er cmd

Command with no options

`);
  });
  it("With location: resulting element is command with type", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(
      { cmd: { kind: "command", type: "string", description: "Command with type" } },
      ["cmd"],
      cliOptions
    );
    expect(output).toBe(`
Usage:  cli-er cmd <string>

Command with type

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
              type: "number",
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
  it("Prints formatted version", () => {
    const logger = jest.spyOn(Cli.logger, "log").mockImplementation();
    formatVersion({ ...cliOptions, cliName: "cli-app", cliVersion: "1.0.0" });
    expect(logger).toHaveBeenCalledWith("  cli-app version: 1.0.0\n");
  });
});
