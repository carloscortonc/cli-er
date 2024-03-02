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
  closestSuggestion,
} from "../src/cli-utils";
import Cli from "../src";
import * as utils from "../src/utils";
import _definition from "./data/definition.json";
//@ts-ignore
import gcmd from "./data/gcmd";
import { CliOptions, Definition, Kind, OptionValue, ParsingOutput } from "../src/types";
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
    opt: { aliases: ["opt", "o"] },
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
    completion: {
      enabled: false,
      command: "generate-completions",
    },
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
      opt: { type: "string", aliases: ["--opt", "-o"] },
    });
  });
  it("Complete aliases for command", () => {
    const cmdDef: Definition<DefinitionElement> = {
      cmd: {
        kind: "command",
        aliases: ["cmd2"],
      },
    };
    const completedDefinition = completeDefinition(cmdDef, cliOptions);
    expect(completedDefinition).toMatchObject({
      cmd: {
        aliases: ["cmd", "cmd2"],
      },
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
        description: "Display global help, or scoped to a namespace/command",
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
        description: "Display version",
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
  const baseConfig = {
    help: { autoInclude: false },
    version: { autoInclude: false },
  };
  const { definition: def, options: cliOptions } = new Cli(definition, baseConfig);
  it("Parse STRING value", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "string", aliases: ["--opt"], key: "opt", default: "defaultvalue" },
    };
    expect(parseArguments(["--opt", "optvalue"], d, cliOptions).options.opt).toBe("optvalue");
    expect(parseArguments(["--opt"], d, cliOptions)).toStrictEqual({
      options: { opt: "defaultvalue", _: [] },
      errors: ['Missing value of type <string> for option "--opt"'],
      location: expect.anything(),
    });
    expect(
      parseArguments(["--opt", "othervalue"], { opt: { ...d.opt, enum: ["optv1", "optv2"] } }, cliOptions),
    ).toStrictEqual({
      options: { opt: "defaultvalue", _: [] },
      errors: ['Wrong value for option "--opt". Expected \'optv1 | optv2\' but found "othervalue"'],
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
      options: { _: [] },
      errors: ['Missing value of type <list> for option "--opt"'],
      location: expect.anything(),
    });
    expect(
      parseArguments(["--opt", "optv1,optv3"], { opt: { ...d.opt, enum: ["optv1", "optv2"] } }, cliOptions),
    ).toStrictEqual({
      options: { _: [] },
      errors: ['Wrong value for option "--opt". Expected \'optv1 | optv2\' but found "optv3"'],
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
      options: { _: [] },
      errors: ['Wrong value for option "--opt". Expected <number> but found "not-a-number"'],
      location: expect.anything(),
    });
    expect(parseArguments(["--opt"], d, cliOptions)).toStrictEqual({
      options: { _: [] },
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
      options: { _: [] },
      errors: ['Wrong value for option "--opt". Expected <float> but found "not-a-number"'],
      location: expect.anything(),
    });
    expect(parseArguments(["--opt"], d, cliOptions)).toStrictEqual({
      options: { _: [] },
      errors: ['Missing value of type <float> for option "--opt"'],
      location: expect.anything(),
    });
  });
  it("Option with parser property", () => {
    const d = new Cli({
      opt: {
        parser: ({ value, option: { key } }) => {
          // return error if value is not a date
          if (isNaN(Date.parse(value || ""))) {
            return {
              error: Cli.formatMessage("option_wrong_value", { option: key, expected: "<date>", found: value! }),
            };
          }
          return { value: new Date(value!) };
        },
      },
    }).definition;
    expect(parseArguments(["--opt", "not-a-date"], d, cliOptions)).toStrictEqual({
      options: { _: [] },
      location: expect.anything(),
      errors: ['Wrong value for option "--opt". Expected <date> but found "not-a-date"'],
    });
  });
  it("No arguments", () => {
    //Get completed definition from Cli
    expect(parseArguments([], def, cliOptions)).toStrictEqual({
      location: [],
      options: { globalOption: "globalvalue", _: [] },
      errors: [],
    });
  });
  it("Command with no type", () => {
    expect(parseArguments(["gcmd"], def, cliOptions)).toStrictEqual({
      location: ["gcmd"],
      options: { globalOption: "globalvalue", _: [] },
      errors: [],
    });
  });
  it("Namespace + command", () => {
    //Get completed definition from Cli
    expect(parseArguments(["nms", "cmd"], def, cliOptions)).toStrictEqual({
      location: ["nms", "cmd"],
      options: { globalOption: "globalvalue", cmd: undefined, _: [] },
      errors: [],
    });
    expect(parseArguments(["nms", "cmd", "cmdValue"], def, cliOptions)).toStrictEqual({
      location: ["nms", "cmd"],
      options: { globalOption: "globalvalue", cmd: "cmdValue", _: [] },
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
      options: expect.objectContaining({ _: [] }),
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
      options: { opt: "optvalue-edited", test: "testvalue", _: [] },
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
  it("Returns error if unknown options are found - without suggestion", () => {
    expect(parseArguments(["nms", "cmd", "cmdvalue", "unknown-option"], def, cliOptions)).toStrictEqual({
      options: expect.anything(),
      location: expect.anything(),
      errors: ['Unknown option "unknown-option"'],
    });
  });
  it("Returns error if unknown options are found - with suggestion", () => {
    expect(parseArguments(["nms", "cmd", "cmdvalue", "--opr"], def, cliOptions)).toStrictEqual({
      options: expect.anything(),
      location: expect.anything(),
      errors: ['Unknown option "--opr". Did you mean "--opt" ?'],
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
      options: { cmd: undefined, opt: 1, globalOption: "globalvalue", _: [] },
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
  it("Detect '--' delimiter", () => {
    const definition = new Cli(
      { nms: { options: { cmd: { options: { opt: {} } } } } },
      { help: { autoInclude: false }, version: { autoInclude: false } },
    ).definition;
    expect(
      parseArguments(
        ["nms", "cmd", "--opt", "optvalue", "--", "firstparam-a firstparam-b", "secondparam"],
        definition as Definition,
        cliOptions,
      ),
    ).toStrictEqual({
      options: { opt: "optvalue", __: ["firstparam-a firstparam-b", "secondparam"], _: [] },
      location: ["nms", "cmd"],
      errors: [],
    });
  });
  it('Unknown option is included in "_"', () => {
    const { definition, options } = new Cli({ cmd: { kind: "command" } }, { ...baseConfig, rootCommand: false });
    expect(parseArguments(["extra"], definition as Definition, options)).toStrictEqual({
      options: { _: ["extra"] },
      location: [],
      errors: ['Command "extra" not found. Did you mean "cmd" ?', 'Unknown option "extra"'],
    });
  });
  it("Positional option (numerical)", () => {
    const { definition, options } = new Cli({ opt: { positional: 0 }, opt2: { positional: 1 } }, baseConfig);
    expect(parseArguments(["optvalue", "opt2value", "extra"], definition as Definition, options)).toStrictEqual({
      options: { _: ["extra"], opt: "optvalue", opt2: "opt2value" },
      location: [],
      errors: ['Unknown option "extra"'],
    });
    expect(
      parseArguments(["optvalue"], { opt: { ...definition.opt, enum: ["optv1", "optv2"] } }, cliOptions),
    ).toStrictEqual({
      options: { _: [] },
      errors: ['Wrong value for option "opt". Expected \'optv1 | optv2\' but found "optvalue"'],
      location: expect.anything(),
    });
  });
  it("Positional option (true)", () => {
    const { definition, options } = new Cli({ opt: {}, popt: { positional: true } }, baseConfig);
    expect(
      parseArguments(
        ["--opt", "optvalue", "extra", "--opt", "optvalue2", "extra2", "--popt", "extra3"],
        definition as Definition,
        options,
      ),
    ).toStrictEqual({
      options: { _: [], opt: "optvalue2", popt: ["extra", "extra2", "extra3"] },
      location: [],
      errors: [],
    });
  });
  it("Positional option (numerical & true) - numerical has precendence", () => {
    const { definition, options } = new Cli({ opt: { positional: true }, opt2: { positional: 1 } }, baseConfig);
    expect(parseArguments(["optvalue", "opt2value", "optvalue2"], definition as Definition, options)).toStrictEqual({
      options: { _: [], opt: ["optvalue", "optvalue2"], opt2: "opt2value" },
      location: [],
      errors: [],
    });
  });
  it("Positional option (numerical) non-required - conflicting with alias", () => {
    const { definition, options } = new Cli({ opt: { positional: 0 }, regopt: { type: "boolean" } }, baseConfig);
    expect(parseArguments(["--regopt"], definition as Definition, options)).toStrictEqual({
      options: { _: [], regopt: true },
      location: [],
      errors: [],
    });
  });
  it("Positional option (numerical) required - conflicting with alias", () => {
    const { definition, options } = new Cli(
      { opt: { positional: 0, required: true }, regopt: { type: "boolean" } },
      baseConfig,
    );
    expect(parseArguments(["--regopt"], definition as Definition, options)).toStrictEqual({
      options: { _: [], regopt: true },
      location: [],
      errors: ['Missing required option "opt"'],
    });
  });
  it("Multiple non-required positional options (numerical) - conflicting with alias", () => {
    const { definition, options } = new Cli(
      { opt1: { positional: 0 }, opt2: { positional: 1 }, regopt: { type: "boolean" } },
      baseConfig,
    );
    expect(parseArguments(["--regopt", "false"], definition as Definition, options)).toStrictEqual({
      options: { _: [], regopt: false },
      location: [],
      errors: [],
    });
  });
  it("Asigning positional option via alias", () => {
    const { definition, options } = new Cli({ opt: { positional: 0 }, regopt: { type: "boolean" } }, baseConfig);
    expect(parseArguments(["--regopt", "--opt", "optvalue"], definition as Definition, options)).toStrictEqual({
      options: { _: [], regopt: true, opt: "optvalue" },
      location: [],
      errors: [],
    });
  });
  it("Positional option inside command's options", () => {
    const { definition, options } = new Cli({ cmd: { options: { opt: { positional: 0 }, regopt: {} } } }, baseConfig);
    expect(
      parseArguments(["cmd", "optvalue", "--regopt", "regoptvalue"], definition as Definition, options),
    ).toStrictEqual({
      options: { _: [], regopt: "regoptvalue", opt: "optvalue" },
      location: ["cmd"],
      errors: [],
    });
  });
  it("Parse {long-alias}={value}", () => {
    const { definition, options } = new Cli({ opt: {}, opt2: {} }, baseConfig);
    expect(parseArguments(["--opt=optvalue", "--opt2", "opt2value"], definition as Definition, options)).toStrictEqual({
      options: { _: [], opt: "optvalue", opt2: "opt2value" },
      location: [],
      errors: [],
    });
  });
  it("Parse {short-alias}{value}", () => {
    const { definition, options } = new Cli({ opt: { aliases: ["o"] }, opt2: {} }, baseConfig);
    expect(parseArguments(["-ooptvalue", "--opt2", "opt2value"], definition as Definition, options)).toStrictEqual({
      options: { _: [], opt: "optvalue", opt2: "opt2value" },
      location: [],
      errors: [],
    });
  });
  it("Parse multiple boolean short flags", () => {
    const { definition, options } = new Cli(
      { a: { type: "boolean" }, b: { type: "boolean" }, c: { type: "boolean" } },
      baseConfig,
    );
    expect(parseArguments(["-abc"], definition as Definition, options)).toStrictEqual({
      options: { _: [], a: true, b: true, c: true },
      location: [],
      errors: [],
    });
    expect(parseArguments(["-cbac"], definition as Definition, options)).toStrictEqual({
      options: { _: [], a: true, b: true, c: true },
      location: [],
      errors: [],
    });
    // Repeated aliases
    expect(parseArguments(["-abca"], definition as Definition, options)).toStrictEqual({
      options: { _: [], a: true, b: true, c: true },
      location: [],
      errors: [],
    });
  });
});

describe("executeScript", () => {
  const cliOptions = new Cli({}).options;
  const debugSpy = jest.spyOn(utils, "debug").mockImplementation();
  const exitlogger = jest.spyOn(utils, "logErrorAndExit").mockImplementation();
  it("Logs error if no baseLocation configured", () => {
    executeScript({ location: [], options: {} as any }, { ...cliOptions, baseLocation: "" });
    expect(exitlogger).toHaveBeenCalledWith("There was a problem finding base script location");
  });
  it("[DEBUG-OFF] No valid script found: exits", () => {
    process.env[utils.CLIER_DEBUG_KEY] = "";
    executeScript({ location: ["non-existent"], options: {} as any }, { ...cliOptions, debug: false });
    expect(exitlogger).toHaveBeenCalled();
  });
  it("[DEBUG-ON] No valid script found: logs error + prints paths", () => {
    process.env[utils.CLIER_DEBUG_KEY] = "1";
    executeScript({ location: ["non-existent"], options: {} as any }, { ...cliOptions, debug: true });
    expect(debugSpy).toHaveBeenCalledWith(
      "WARN",
      expect.stringContaining("There was a problem finding the script to run. Considered paths were:\n"),
    );
    expect(exitlogger).toHaveBeenCalled();
    //Restore debug value
    process.env[utils.CLIER_DEBUG_KEY] = "";
  });
  it("Generates all valid paths with the corresponding named/default import - namespace", () => {
    const c = new Cli(definition, { baseLocation: "/" });
    const pathListSpy = jest.spyOn(fs, "existsSync").mockImplementation(() => false);
    executeScript({ location: ["nms", "cmd"], options: {} as any }, c.options);
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
  it("Generates all valid paths with the corresponding named/default import - single command", () => {
    const c = new Cli(definition, { baseLocation: "/base", commandsPath: "../commands" });
    const pathListSpy = jest.spyOn(fs, "existsSync").mockImplementation(() => false);
    executeScript({ location: ["gcmd"], options: {} as any }, c.options);
    const norm = (p: string) => p.replace(/\//g, path.sep);
    expect(pathListSpy.mock.calls).toEqual([
      [norm("/commands/gcmd/index.js")],
      [norm("/commands/gcmd.js")],
      [norm("/commands/index.js")],
      [norm("/commands.js")],
      [norm("/base/index.js")],
      [norm("/base/script.js")],
    ]);
    pathListSpy.mockRestore();
  });
  it("Script execution fails: logs error", () => {
    (gcmd as any).mockImplementation(() => {
      throw new Error("errormessage");
    });
    executeScript({ location: ["data", "gcmd"], options: {} as any }, cliOptions);
    expect(exitlogger).toHaveBeenCalledWith(
      expect.stringMatching("There was a problem executing the script (.+: errormessage)"),
    );
  });
  it("Executes script if found", () => {
    (gcmd as any).mockImplementation();
    executeScript({ location: ["data", "gcmd"], options: { gcmd: "gcmdvalue" } as any }, cliOptions);
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
  -g, --global  Option shared between all commands (default: "globalvalue")
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
  -g, --global  Option shared between all commands (default: "globalvalue")
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
Usage:  cli-name NAMESPACE

Namespaces:
  nms  -

This is a custom footer
`);
  });
  it("With options", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    const { definition: def } = new Cli({
      bool: { type: "boolean", default: true, description: "boolean option" },
      num: { type: "number", default: 10, description: "number option" },
      float: { type: "float", default: 0.5, description: "float option" },
      list: { type: "list", default: ["one", "two"], description: "list option" },
      enum: { enum: ["opt1", "opt2"], description: "string with enum" },
      enumdef: { enum: ["opt1", "opt2"], default: "opt1", description: "string with enum and default" },
      arg1: { positional: 0, required: true, description: "first positional mandatory option" },
      arg2: { positional: 1, description: "second positional option" },
      arg3: { positional: true, description: "catch-all positional option" },
    });
    generateScopedHelp(def, [], cliOptions);
    expect(output).toStrictEqual(`
Usage:  cli-name <arg1> [arg2] [arg3...] [OPTIONS]

cli-description

Options:
  --bool      boolean option (default: true)
  --num       number option (default: 10)
  --float     float option (default: 0.5)
  --list      list option (default: "one", "two")
  --enum      string with enum (allowed: "opt1", "opt2")
  --enumdef   string with enum and default (allowed: "opt1", "opt2", default: "opt1")
  --arg1      first positional mandatory option
  --arg2      second positional option
  --arg3      catch-all positional option
  -h, --help  Display global help, or scoped to a namespace/command

`);
  });
  it("Takes tty columns into account when formatting options", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    const { definition: def } = new Cli({
      opt: { description: "long description for option" },
      abc: { description: "abcdefghijklmnñopqrstuvwxyz" },
    });
    const actualColumns = process.stdout.columns;
    process.stdout.columns = 40;
    generateScopedHelp(def, [], cliOptions);
    process.stdout.columns = actualColumns;
    expect(output).toStrictEqual(`
Usage:  cli-name [OPTIONS]

cli-description

Options:
  --opt       long description for 
               option
  --abc       abcdefghijklmnñopqrstuv-
               wxyz
  -h, --help  Display global help, or 
               scoped to a 
               namespace/command

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
          aliases: ["-g", "global"],
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
      kind: "command",
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
  it("Prints default formatted version", () => {
    const cliOptions = new Cli({}).options;
    const logger = jest.spyOn(Cli.logger, "log").mockImplementation();
    formatVersion({ ...cliOptions, cliName: "cli-app", cliVersion: "1.0.0" });
    expect(logger).toHaveBeenCalledWith("  cli-app version: 1.0.0\n");
  });
  it("Override version-template", () => {
    const cliOptions = new Cli({}, { messages: { "generate-version.template": "{cliName} version {cliVersion}" } })
      .options;
    const logger = jest.spyOn(Cli.logger, "log").mockImplementation();
    formatVersion({ ...cliOptions, cliName: "cli-app", cliVersion: "1.0.0" });
    expect(logger).toHaveBeenCalledWith("cli-app version 1.0.0");
  });
});

describe("closesSuggestion", () => {
  const c = new Cli(definition);
  it("Returns closest suggestion for the given parameters", () => {
    expect(
      closestSuggestion({
        target: "--opr",
        definition: c.definition,
        rawLocation: ["nms", "cmd"],
        cliOptions: c.options,
        kind: [Kind.OPTION],
      }),
    ).toBe("--opt");
  });
  it("Returns closest suggestion for the given parameters - maxDistance", () => {
    expect(
      closestSuggestion({
        target: "--oor",
        definition: c.definition,
        rawLocation: ["nms", "cmd"],
        cliOptions: c.options,
        kind: [Kind.OPTION],
        maxDistance: 1,
      }),
    ).toBe(undefined);
  });
});
