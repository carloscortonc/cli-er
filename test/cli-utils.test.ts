import {
  completeDefinition,
  parseArguments,
  executeScript,
  generateScopedHelp,
  getDefinitionElement,
} from "../src/cli-utils";
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
      showOnFail: true,
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
  it("Includes help option if auto-include help option is enabled", () => {
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
    expect(parseArguments(["nms", "cmd"], d, cliOptions)).toStrictEqual({
      location: ["nms", "cmd"],
      options: { globalOption: "globalvalue", cmd: undefined, opt: undefined },
    });
    expect(parseArguments(["nms", "cmd", "cmdValue"], d, cliOptions)).toStrictEqual({
      location: ["nms", "cmd"],
      options: { globalOption: "globalvalue", cmd: "cmdValue", opt: undefined },
    });
  });
});

describe("executeScript", () => {
  const cliOptions = new Cli({}).options;
  it("Logs error if no baseScriptLocation configured", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error").mockImplementation(() => {});
    executeScript({ location: [], options: {} }, { ...cliOptions, baseScriptLocation: "" }, {});
    expect(errorlogger).toHaveBeenCalledWith("There was a problem finding base script location");
  });
  it("Logs error if no location provided (no options.help.showOnFail)", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error").mockImplementation(() => {});
    const rawlogger = jest.spyOn(utils.Logger, "raw").mockImplementation(() => true);
    executeScript(
      { location: [], options: {} },
      { ...cliOptions, help: { ...cliOptions.help, showOnFail: false } },
      {}
    );
    expect(errorlogger).toHaveBeenCalledWith("No location provided to execute the script");
    expect(rawlogger).not.toHaveBeenCalled();
  });
  it("Prints help if no location provided (with options.help.showOnFail)", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error").mockImplementation(() => {});
    const rawlogger = jest.spyOn(utils.Logger, "raw").mockImplementation(() => true);
    executeScript({ location: [], options: {} }, cliOptions, { opt: { description: "description" } });
    expect(rawlogger).toHaveBeenCalledWith(expect.stringContaining("Global options:"));
    expect(errorlogger).not.toHaveBeenCalled();
  });
  it("Logs error if script require fails (no options.help.showOnFail)", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error").mockImplementation(() => {});
    const rawlogger = jest.spyOn(utils.Logger, "raw").mockImplementation(() => true);
    jest.spyOn(utils.Logger, "log").mockImplementation(() => {});
    executeScript(
      { location: ["not-existing"], options: {} },
      { ...cliOptions, help: { ...cliOptions.help, showOnFail: false } },
      {}
    );
    expect(errorlogger).toHaveBeenCalledWith(
      expect.stringContaining("There was a problem finding the script to run. ")
    );
    expect(rawlogger).not.toHaveBeenCalled();
  });
  it("Logs error + prints scoped help if script require fails (with options.help.showOnFail)", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error").mockImplementation(() => {});
    const rawlogger = jest.spyOn(utils.Logger, "raw").mockImplementation(() => true);
    executeScript({ location: ["not-existing"], options: {} }, cliOptions, { opt: { description: "description" } });
    expect(errorlogger).toHaveBeenCalledWith(
      expect.stringContaining("There was a problem finding the script to run. ")
    );
    expect(rawlogger).toHaveBeenCalledWith(expect.stringContaining("Global options:"));
  });
  it("Executes script if found", () => {
    const errorlogger = jest.spyOn(utils.Logger, "error").mockImplementation(() => {});
    executeScript({ location: ["data", "gcmd"], options: { gcmd: "gcmdvalue" } }, cliOptions, {});
    expect(gcmd).toHaveBeenCalledWith({ gcmd: "gcmdvalue" });
    expect(errorlogger).not.toHaveBeenCalled();
  });
});

describe("generateScopedHelp", () => {
  const cliOptions = new Cli({}).options;
  const rawlogger = jest.spyOn(utils.Logger, "raw").mockImplementation(() => true);
  it("With empty location (first level definition)", () => {
    let output = "";
    rawlogger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(definition, [], cliOptions);
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
    rawlogger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(definition, ["nms"], cliOptions);
    expect(output).toBe(`
Description for the namespace

Commands:
  cmd  Description for the command

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
