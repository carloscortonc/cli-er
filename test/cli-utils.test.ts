import { completeDefinition, parseArguments, executeScript, generateScopedHelp } from "../src/cli-utils";
import Cli from "../src";
import * as utils from "../src/utils";
import definition from "./data/definition.json";
//@ts-ignore
import gcmd from "./data/gcmd";

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock("./data/gcmd", () => jest.fn());

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
    baseScriptLocation: "",
    commandsPath: "",
    help: {
      autoInclude: false,
      aliases: [],
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
    });
  });
  it("Includes help option if auto-include help option is enabled", () => {
    const cliOptions_ = {
      ...cliOptions,
      help: {
        autoInclude: true,
        aliases: ["-h"],
      },
    };
    const completedDefinition = completeDefinition(definition, cliOptions_);
    expect(completedDefinition).toMatchObject({
      help: {
        type: "boolean",
        aliases: ["-h"],
        description: "Display global help, or scoped to a namespace/command",
      },
    });
  });
});

describe("parseArguments", () => {
  //Get default options from Cli
  const cliOptions = new Cli({}).options;
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
  it("Parse definition: no arguments", () => {
    //Get completed definition from Cli
    const d = new Cli(definition, { help: { autoInclude: false } }).definition;
    expect(parseArguments([], d, cliOptions)).toStrictEqual({
      location: [],
      options: { globalOption: "globalvalue" },
    });
  });
  it("Parse definition: namespace + command", () => {
    //Get completed definition from Cli
    const d = new Cli(definition, { help: { autoInclude: false } }).definition;
    expect(parseArguments(["nms", "cmd", "cmdValue"], d, cliOptions)).toStrictEqual({
      location: ["nms", "cmd"],
      options: { globalOption: "globalvalue", cmd: "cmdValue" },
    });
  });
});

describe("executeScript", () => {
  const cliOptions = new Cli({}).options;
  it("Logs error if no baseScriptLocation configured", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error");
    executeScript({ location: [], options: {} }, { ...cliOptions, baseScriptLocation: "" });
    expect(errorlogger).toHaveBeenCalledWith("There was a problem finding base script location");
  });
  it("Logs error if no location provided", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error");
    executeScript({ location: [], options: {} }, cliOptions);
    expect(errorlogger).toHaveBeenCalledWith("No location provided to execute the script");
  });
  it("Logs error if script require fails", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error");
    executeScript({ location: ["not-existing"], options: {} }, cliOptions);
    expect(errorlogger).toHaveBeenCalledWith(
      expect.stringContaining("There was a problem finding the script to run. ")
    );
  });
  it("Executes script if found", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error");
    executeScript({ location: ["data", "gcmd"], options: { gcmd: "gcmdvalue" } }, cliOptions);
    expect(gcmd).toHaveBeenCalledWith({ gcmd: "gcmdvalue" });
    expect(errorlogger).not.toHaveBeenCalled();
  });
});

describe("generateScopedHelp", () => {
  const printSpy = jest.spyOn(process.stdout, "write");
  it("With empty location (first level definition)", () => {
    let output = "";
    printSpy.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(definition, []);
    expect(output).toBe(`
Namespaces:
  nms           Description for the namespace

Commands:
  gcmd          Description for global command

Global options:
  -g, --global  Option shared between all commands (default: globalvalue)

`);
  });
  it("With location", () => {
    let output = "";
    printSpy.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(definition, ["nms"]);
    expect(output).toBe(`
Description for the namespace

Commands:
  cmd  Description for the command

`);
  });
});
