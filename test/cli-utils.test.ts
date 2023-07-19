import fs from "fs";
import path from "path";
import {
  completeDefinition,
  parseArguments,
  executeScript,
  generateScopedHelp,
  getDefinitionElement,
  formatVersion,
  DefinitionElement,
} from "../src/cli-utils";
import Cli from "../src";
import * as utils from "../src/utils";
import _definition from "./data/definition.json";
//@ts-ignore
import gcmd from "./data/gcmd";
import { CliOptions, Definition, OptionValue, ParsingOutput } from "../src/types";
const definition = _definition as Definition;

beforeEach(() => {
  jest.clearAllMocks();
});

jest.mock("./data/gcmd", () => jest.fn());
jest.mock("path", () => ({ ...jest.requireActual("path"), parse: () => ({ name: "script", ext: ".js" }) }));
jest.spyOn(process, "exit").mockImplementation();

describe("completeDefinition", () => {
  const d: Definition<DefinitionElement> = {
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
  const cliOptions: CliOptions = {
    baseLocation: "",
    baseScriptLocation: "",
    commandsPath: "",
    errors: {
      onGenerateHelp: [],
      onExecuteCommand: [],
    },
    help: {
      autoInclude: false,
      type: "boolean",
      aliases: [],
      description: "",
      template: "",
    },
    version: {
      autoInclude: false,
      type: "boolean",
      aliases: [],
      description: "",
    },
    rootCommand: true,
    cliName: "",
    cliVersion: "",
    cliDescription: "",
    debug: false,
  };
  it("Completes missing fields in definition with nested content ", () => {
    const completedDefinition = completeDefinition(d, cliOptions);
    expect(completedDefinition).toMatchObject({
      nms: {
        aliases: ["nms"],
        key: "nms",
        options: {
          cmd: {
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
    const completedDefinition = completeDefinition(d, cliOptions_);
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
    const completedDefinition = completeDefinition(d, cliOptions_);
    expect(completedDefinition).toMatchObject({
      version: {
        type: "boolean",
        aliases: ["-v"],
        description: "",
      },
    });
  });
  it("Infer element.kind when missing", () => {
    expect(
      completeDefinition(
        {
          nms1: {
            options: {
              cmd: {
                // command with "action"
                action: () => {},
              },
            },
          },
          nms2: {
            options: {
              cmd: {
                // command with options (even empty)
                options: {},
              },
            },
          },
          cmd: {
            // all options are of kind Option
            options: {
              debug: { type: "boolean" },
            },
          },
        },
        cliOptions,
      ),
    ).toEqual({
      nms1: expect.objectContaining({
        kind: "namespace",
        options: {
          cmd: expect.objectContaining({ kind: "command" }),
        },
      }),
      nms2: expect.objectContaining({
        kind: "namespace",
        options: {
          cmd: expect.objectContaining({ kind: "command" }),
        },
      }),
      cmd: expect.objectContaining({
        kind: "command",
        options: expect.objectContaining({
          debug: expect.objectContaining({ type: "boolean", kind: "option" }),
        }),
      }),
    });
  });
});

describe("parseArguments", () => {
  //Get default options from Cli
  const { definition: def, options: cliOptions } = new Cli(definition, {
    help: { autoInclude: false },
    version: { autoInclude: false },
  });
  it("Parse STRING value", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "string", aliases: ["--opt"], key: "opt", default: "defaultvalue" },
    };
    expect(parseArguments(["--opt", "optvalue"], d, cliOptions).options.opt).toBe("optvalue");
    expect(parseArguments(["--opt"], d, cliOptions)).toStrictEqual({
      options: { opt: "defaultvalue" },
      errors: ['Missing value of type <string> for option "--opt"'],
      location: expect.anything(),
    });
  });
  it("Parse BOOLEAN value", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "boolean", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "true"], d, cliOptions).options.opt).toBe(true);
    expect(parseArguments(["--opt"], d, cliOptions).options.opt).toBe(true);
    expect(parseArguments(["--opt", "false"], d, cliOptions).options.opt).toBe(false);

    const d2: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "boolean", aliases: ["--opt"], key: "opt", default: true },
    };
    expect(parseArguments(["--opt", "false"], d2, cliOptions).options.opt).toBe(false);
    expect(parseArguments([], d2, cliOptions).options.opt).toBe(true);
  });
  it("Parse LIST value", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "list", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "one,two"], d, cliOptions).options.opt).toStrictEqual(["one", "two"]);
    expect(parseArguments(["--opt"], d, cliOptions)).toStrictEqual({
      options: { opt: undefined },
      errors: ['Missing value of type <list> for option "--opt"'],
      location: expect.anything(),
    });
  });
  it("Parse LIST value by repeated appearances", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "list", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "one,two", "--opt", "three"], d, cliOptions).options.opt).toStrictEqual([
      "one",
      "two",
      "three",
    ]);
  });
  it("Parse NUMBER value", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "number", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "1"], d, cliOptions).options.opt).toBe(1);
    expect(parseArguments(["--opt", "not-a-number"], d, cliOptions)).toStrictEqual({
      options: { opt: undefined },
      errors: ['Wrong value for option "--opt". Expected <number> but found "not-a-number"'],
      location: expect.anything(),
    });
    expect(parseArguments(["--opt"], d, cliOptions)).toStrictEqual({
      options: { opt: undefined },
      errors: ['Missing value of type <number> for option "--opt"'],
      location: expect.anything(),
    });
  });
  it("Parse FLOAT value", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "float", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments(["--opt", "1.5"], d, cliOptions).options.opt).toBe(1.5);
    expect(parseArguments(["--opt", "not-a-number"], d, cliOptions)).toStrictEqual({
      options: { opt: undefined },
      errors: ['Wrong value for option "--opt". Expected <float> but found "not-a-number"'],
      location: expect.anything(),
    });
    expect(parseArguments(["--opt"], d, cliOptions)).toStrictEqual({
      options: { opt: undefined },
      errors: ['Missing value of type <float> for option "--opt"'],
      location: expect.anything(),
    });
  });
  it("Option with parser property", () => {
    const d = new Cli({
      opt: {
        parser: ({ value, format }) => {
          // return error if value is not a date
          if (isNaN(Date.parse(value || ""))) {
            return { error: format("option_wrong_value", "x", "x", "x") };
          }
          return { value: new Date(value!) };
        },
      },
    }).definition;
    expect(parseArguments(["--opt", "not-a-date"], d, cliOptions)).toStrictEqual({
      options: { opt: undefined, version: undefined, help: undefined },
      location: expect.anything(),
      errors: [expect.stringContaining("Wrong value for option")],
    });
  });
  it("No arguments", () => {
    //Get completed definition from Cli
    expect(parseArguments([], def, cliOptions)).toStrictEqual({
      location: [],
      options: { globalOption: "globalvalue" },
      errors: [],
    });
  });
  it("Command with no type", () => {
    expect(parseArguments(["gcmd"], def, cliOptions)).toStrictEqual({
      location: ["gcmd"],
      options: { globalOption: "globalvalue" },
      errors: [],
    });
  });
  it("Namespace + command", () => {
    //Get completed definition from Cli
    expect(parseArguments(["nms", "cmd"], def, cliOptions)).toStrictEqual({
      location: ["nms", "cmd"],
      options: { globalOption: "globalvalue", cmd: undefined, opt: undefined },
      errors: [],
    });
    expect(parseArguments(["nms", "cmd", "cmdValue"], def, cliOptions)).toStrictEqual({
      location: ["nms", "cmd"],
      options: { globalOption: "globalvalue", cmd: "cmdValue", opt: undefined },
      errors: [],
    });
  });
  it("No args but rootCommand:string", () => {
    const c = new Cli(
      {
        cmd: {
          options: { opt: { type: "string" } },
        },
      },
      { rootCommand: "cmd" },
    );
    expect(parseArguments([], c.definition, c.options)).toStrictEqual({
      options: expect.objectContaining({ opt: undefined }),
      location: [],
      errors: [],
    });
  });
  it("[deprecated] Option with value property", () => {
    const d = new Cli({
      cmd: {
        kind: "command",
      },
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
    }).definition as Definition<DefinitionElement>;
    expect(parseArguments(["--opt", "optvalue"], d, cliOptions)).toStrictEqual({
      options: { opt: "optvalue-edited", test: "testvalue", version: undefined, help: undefined },
      location: expect.anything(),
      errors: [],
    });
  });
  it("Returns error if wrong namespace/command provided", () => {
    expect(parseArguments(["nms", "non-existent"], def, cliOptions)).toStrictEqual({
      options: expect.anything(),
      location: expect.anything(),
      errors: ['Command "non-existent" not found. Did you mean "cmd" ?', 'Unknown option "non-existent"'],
    });
  });
  it("Returns error if unknown options are found", () => {
    expect(parseArguments(["nms", "cmd", "cmdvalue", "unknown-option"], def, cliOptions)).toStrictEqual({
      options: expect.anything(),
      location: expect.anything(),
      errors: ['Unknown option "unknown-option"'],
    });
  });
  it("Returns error if option has incorrect value", () => {
    expect(parseArguments(["nms", "cmd", "cmdvalue", "--opt", "true"], def, cliOptions)).toStrictEqual({
      options: expect.anything(),
      location: expect.anything(),
      errors: ['Wrong value for option "--opt". Expected <number> but found "true"'],
    });
  });
  it("Option alias should have preference over other option values", () => {
    expect(parseArguments(["nms", "cmd", "--opt", "1"], def, cliOptions)).toStrictEqual({
      options: { cmd: undefined, opt: 1, globalOption: "globalvalue" },
      location: expect.anything(),
      errors: [],
    });
  });
  it("Return error if required option not provided", () => {
    const definition = new Cli({ opt: { required: true } }).definition;
    expect(parseArguments([], definition as Definition, cliOptions)).toStrictEqual({
      options: expect.anything(),
      location: [],
      errors: ['Missing required option "opt"'],
    });
  });
});

describe("executeScript", () => {
  const cliOptions = new Cli({}).options;
  const debugSpy = jest.spyOn(utils, "debug").mockImplementation();
  const exitlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
  it("Logs error if no baseScriptLocation configured", () => {
    executeScript({ location: [], options: {} }, { ...cliOptions, baseScriptLocation: "" });
    expect(exitlogger).toHaveBeenCalledWith("There was a problem finding base script location");
  });
  it("[DEBUG-OFF] No valid script found: exits", () => {
    process.env[utils.CLIER_DEBUG_KEY] = "";
    executeScript({ location: ["non-existent"], options: {} }, { ...cliOptions, debug: false });
    expect(exitlogger).toHaveBeenCalled();
  });
  it("[DEBUG-ON] No valid script found: logs error + prints paths", () => {
    process.env[utils.CLIER_DEBUG_KEY] = "1";
    executeScript({ location: ["non-existent"], options: {} }, { ...cliOptions, debug: true });
    expect(debugSpy).toHaveBeenCalledWith(
      expect.stringContaining("There was a problem finding the script to run. Considered paths were:\n"),
    );
    expect(exitlogger).toHaveBeenCalled();
  });
  it("Generates all valid paths with the corresponding named/default import", () => {
    const c = new Cli(definition, { baseScriptLocation: "/" });
    const pathListSpy = jest.spyOn(fs, "existsSync").mockImplementation(() => false);
    executeScript({ location: ["nms", "cmd"], options: {} }, c.options);
    const norm = (p: string) => p.replace(/\//g, path.sep);
    expect(pathListSpy.mock.calls).toEqual([
      [norm("/nms/cmd/index.js")],
      [norm("/nms/cmd.js")],
      [norm("/nms/index.js")],
      [norm("/nms.js")],
      [norm("/index.js")],
      [norm("/script.js")],
    ]);
    pathListSpy.mockRestore();
  });
  it("Script execution fails: logs error", () => {
    (gcmd as any).mockImplementation(() => {
      throw new Error("errormessage");
    });
    executeScript({ location: ["data", "gcmd"], options: {} }, cliOptions);
    expect(exitlogger).toHaveBeenCalledWith(
      expect.stringMatching("There was a problem executing the script (.+: errormessage)"),
    );
  });
  it("Executes script if found", () => {
    (gcmd as any).mockImplementation();
    executeScript({ location: ["data", "gcmd"], options: { gcmd: "gcmdvalue" } }, cliOptions);
    expect(gcmd).toHaveBeenCalledWith({ gcmd: "gcmdvalue" });
    expect(exitlogger).not.toHaveBeenCalled();
  });
});

describe("generateScopedHelp", () => {
  const cliOptions = new Cli({}, { cliName: "cli-name", cliDescription: "cli-description" }).options;
  const logger = jest.spyOn(Cli.logger, "log").mockImplementation();
  const d = new Cli(definition).definition;
  it("With empty location (first level definition)", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(d, [], cliOptions);
    expect(output).toBe(`
Usage:  cli-name NAMESPACE|COMMAND [OPTIONS]

cli-description

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
Usage:  cli-name nms COMMAND [OPTIONS]

Description for the namespace

Commands:
  cmd           Description for the command

Options:
  -g, --global  Option shared between all commands (default: globalvalue)
  -h, --help    Display global help, or scoped to a namespace/command

`);
  });
  it("With location: resulting element has no options", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp({ cmd: { kind: "command", description: "Command with no options" } }, ["cmd"], cliOptions);
    expect(output).toBe(`
Usage:  cli-name cmd

Command with no options

`);
  });
  it("With location: resulting element is command with type", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(
      { cmd: { kind: "command", type: "string", description: "Command with type" } },
      ["cmd"],
      cliOptions,
    );
    expect(output).toBe(`
Usage:  cli-name cmd <string>

Command with type

`);
  });
  it("With location: part of the given location is wrong", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    generateScopedHelp(d, ["nms", "unknown"], cliOptions);
    expect(output).toStrictEqual(
      expect.stringContaining(`
Unable to find the specified scope (nms > unknown)

Usage:  cli-name NAMESPACE|COMMAND [OPTIONS]`),
    );
  });
  it("With custom footer via CliOptions.help.template", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    const def: Definition<DefinitionElement> = {
      nms: { kind: "namespace", aliases: ["nms"] },
      opt: { aliases: ["--opt"], kind: "option", type: "boolean", hidden: true },
    };
    generateScopedHelp(def, [], {
      ...cliOptions,
      help: {
        ...cliOptions.help,
        template: "\n{usage}\n{namespaces}\n{commands}\n{options}\nThis is a custom footer\n",
      },
    });
    expect(output).toStrictEqual(`
Usage:  cli-name NAMESPACE [OPTIONS]

Namespaces:
  nms  -

This is a custom footer
`);
  });
});

describe("getDefinitionElement", () => {
  const { options: cliOptions } = new Cli(definition);
  it("Returns the original definition when provided with empty location array", () => {
    expect(getDefinitionElement(definition, [], cliOptions)).toStrictEqual(definition);
  });
  it("Returns the scoped definition, including inherited options", () => {
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
        globalOption: {
          aliases: ["-g", "--global"],
          default: "globalvalue",
          description: "Option shared between all commands",
          kind: "option",
        },
      },
    });
  });
  it("Does not take into account commandPath when encountered", () => {
    expect(getDefinitionElement(definition, ["commands", "gcmd"], cliOptions)).toStrictEqual({
      description: "Description for global command",
      kind: "command",
      options: expect.anything(),
    });
  });
  it("Includes all inherited options", () => {
    const de = getDefinitionElement(definition, ["nmsi", "nested-nms", "cmd"], cliOptions);
    expect(de).toStrictEqual({
      kind: "cmd",
      options: {
        "nested-nms-o": expect.anything(),
        "nmsi-o": expect.anything(),
        globalOption: expect.anything(),
      },
    });
    // Assert the order of the options
    expect(Object.keys(de!.options as object)).toStrictEqual(["nested-nms-o", "nmsi-o", "globalOption"]);
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
