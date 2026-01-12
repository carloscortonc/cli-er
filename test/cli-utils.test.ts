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
      opt: {
        kind: "option",
        type: "string",
        aliases: ["--opt"],
        key: "opt",
        default: "defaultvalue",
        enum: ["optvalue"],
      },
    };
    expect(parseArguments({ args: ["--opt", "optvalue"], definition: d, cliOptions }).options.opt).toBe("optvalue");
    expect(parseArguments({ args: ["--opt"], definition: d, cliOptions })).toStrictEqual(
      expect.objectContaining({
        options: { opt: "defaultvalue", _: [] },
        errors: ['Missing value of type <string> for option "--opt"'],
      }),
    );
    expect(
      parseArguments({
        args: ["--opt", "othervalue"],
        definition: { opt: { ...d.opt, enum: ["optv1", "optv2"] } },
        cliOptions,
      }),
    ).toStrictEqual(
      expect.objectContaining({
        options: { opt: "defaultvalue", _: [] },
        errors: ['Wrong value for option "--opt". Expected \'optv1 | optv2\' but found "othervalue"'],
      }),
    );
  });
  it("Parse BOOLEAN value", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "boolean", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments({ args: ["--opt", "true"], definition: d, cliOptions }).options.opt).toBe(true);
    expect(parseArguments({ args: ["--opt"], definition: d, cliOptions }).options.opt).toBe(true);
    expect(parseArguments({ args: ["--opt", "false"], definition: d, cliOptions }).options.opt).toBe(false);

    const d2: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "boolean", aliases: ["--opt"], key: "opt", default: true },
    };
    expect(parseArguments({ args: ["--opt", "false"], definition: d2, cliOptions }).options.opt).toBe(false);
    expect(parseArguments({ args: [], definition: d2, cliOptions }).options.opt).toBe(true);
    const d3: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "boolean", aliases: ["--opt"], key: "opt", default: false },
    };
    expect(parseArguments({ args: [], definition: d3, cliOptions }).options.opt).toBe(false);
  });
  it("Parse LIST value", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "list", aliases: ["--opt"], key: "opt" },
    };
    expect(parseArguments({ args: ["--opt", "one,two"], definition: d, cliOptions }).options.opt).toStrictEqual([
      "one",
      "two",
    ]);
    expect(parseArguments({ args: ["--opt"], definition: d, cliOptions })).toStrictEqual(
      expect.objectContaining({
        options: { _: [] },
        errors: ['Missing value of type <list> for option "--opt"'],
      }),
    );
    expect(
      parseArguments({
        args: ["--opt", "optv1,optv3"],
        definition: { opt: { ...d.opt, enum: ["optv1", "optv2"] } },
        cliOptions,
      }),
    ).toStrictEqual(
      expect.objectContaining({
        options: { _: [] },
        errors: ['Wrong value for option "--opt". Expected \'optv1 | optv2\' but found "optv3"'],
      }),
    );
  });
  it("Parse LIST value by repeated appearances", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "list", aliases: ["--opt"], key: "opt", enum: ["one", "two", "three"] },
    };
    expect(
      parseArguments({ args: ["--opt", "one,two", "--opt", "three"], definition: d, cliOptions }).options.opt,
    ).toStrictEqual(["one", "two", "three"]);
  });
  it("parse LIST value with default", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "list", aliases: ["--opt"], key: "opt", default: ["one"] },
    };
    expect(parseArguments({ args: [], definition: d, cliOptions }).options.opt).toStrictEqual(["one"]);
    expect(parseArguments({ args: ["--opt", "two"], definition: d, cliOptions }).options.opt).toStrictEqual(["two"]);
  });
  it("Parse NUMBER value", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "number", aliases: ["--opt"], key: "opt", enum: [1] },
    };
    expect(parseArguments({ args: ["--opt", "1"], definition: d, cliOptions }).options.opt).toBe(1);
    expect(parseArguments({ args: ["--opt", "not-a-number"], definition: d, cliOptions })).toStrictEqual(
      expect.objectContaining({
        options: { _: [] },
        errors: ['Wrong value for option "--opt". Expected <number> but found "not-a-number"'],
      }),
    );
    expect(parseArguments({ args: ["--opt"], definition: d, cliOptions })).toStrictEqual(
      expect.objectContaining({
        options: { _: [] },
        errors: ['Missing value of type <number> for option "--opt"'],
      }),
    );
    expect(
      parseArguments({ args: ["--opt", "5"], definition: { opt: { ...d.opt, enum: [1, 10, 20] } }, cliOptions }),
    ).toStrictEqual(
      expect.objectContaining({
        options: { _: [] },
        errors: ['Wrong value for option "--opt". Expected \'1 | 10 | 20\' but found "5"'],
      }),
    );
  });
  it("Parse FLOAT value", () => {
    const d: Definition<DefinitionElement> = {
      opt: { kind: "option", type: "float", aliases: ["--opt"], key: "opt", enum: [1.5] },
    };
    expect(parseArguments({ args: ["--opt", "1.5"], definition: d, cliOptions }).options.opt).toBe(1.5);
    expect(parseArguments({ args: ["--opt", "not-a-number"], definition: d, cliOptions })).toStrictEqual(
      expect.objectContaining({
        options: { _: [] },
        errors: ['Wrong value for option "--opt". Expected <float> but found "not-a-number"'],
      }),
    );
    expect(parseArguments({ args: ["--opt"], definition: d, cliOptions })).toStrictEqual(
      expect.objectContaining({
        options: { _: [] },
        errors: ['Missing value of type <float> for option "--opt"'],
      }),
    );
    expect(
      parseArguments({ args: ["--opt", "0.5"], definition: { opt: { ...d.opt, enum: [0.3, 0.6, 0.9] } }, cliOptions }),
    ).toStrictEqual(
      expect.objectContaining({
        options: { _: [] },
        errors: ['Wrong value for option "--opt". Expected \'0.3 | 0.6 | 0.9\' but found "0.5"'],
      }),
    );
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
    expect(parseArguments({ args: ["--opt", "not-a-date"], definition: d, cliOptions })).toStrictEqual(
      expect.objectContaining({
        options: { _: [] },
        errors: ['Wrong value for option "--opt". Expected <date> but found "not-a-date"'],
      }),
    );
  });
  describe("Option.stdin", () => {
    it("No '-' provided", () => {
      const d = new Cli({ opt: { stdin: true } }).definition;
      expect(parseArguments({ args: [], definition: d, cliOptions }).options.opt).toBe(undefined);
    });
    it("'-' provided, isTTY=true", () => {
      const i = process.stdin.isTTY;
      process.stdin.isTTY = true;
      const d = new Cli({ opt: { stdin: true } }).definition;
      expect(parseArguments({ args: ["--opt", "-"], definition: d, cliOptions }).options.opt).toBe("-");
      process.stdin.isTTY = i;
    });
    it("'-' provided, isTTY=undefined - read stdin", () => {
      const i = process.stdin.isTTY;
      process.stdin.isTTY = undefined as any;
      jest.spyOn(fs, "readFileSync").mockImplementation(() => "stdin-value");
      const d = new Cli({ opt: { stdin: true } }).definition;
      expect(parseArguments({ args: ["--opt", "-"], definition: d, cliOptions }).options.opt).toBe("stdin-value");
      process.stdin.isTTY = i;
    });
  });
  it("No arguments", () => {
    //Get completed definition from Cli
    expect(parseArguments({ args: [], definition: def, cliOptions })).toStrictEqual({
      location: [],
      options: { globalOption: "globalvalue", _: [] },
      errors: [],
      rawLocation: [],
    });
  });
  it("Command with no type", () => {
    expect(parseArguments({ args: ["gcmd"], definition: def, cliOptions })).toStrictEqual({
      location: ["gcmd"],
      options: { globalOption: "globalvalue", _: [] },
      errors: [],
      rawLocation: ["gcmd"],
    });
  });
  it("Namespace + command", () => {
    //Get completed definition from Cli
    expect(parseArguments({ args: ["nms", "cmd"], definition: def, cliOptions })).toStrictEqual({
      location: ["nms", "cmd"],
      options: { globalOption: "globalvalue", cmd: undefined, _: [] },
      errors: [],
      rawLocation: ["nms", "cmd"],
    });
    expect(parseArguments({ args: ["nms", "cmd", "cmdValue"], definition: def, cliOptions })).toStrictEqual({
      location: ["nms", "cmd"],
      options: { globalOption: "globalvalue", cmd: "cmdValue", _: [] },
      errors: [],
      rawLocation: ["nms", "cmd"],
    });
  });
  it("Namespace with default command", () => {
    let c = new Cli({
      nms: {
        kind: "namespace",
        default: "a",
        options: {
          a: { kind: "command", options: { aa: { required: true } } },
          b: { kind: "command" },
          c: { kind: "option" },
        },
      },
    });
    expect(parseArguments({ args: ["nms"], definition: c.definition, cliOptions: c.options })).toStrictEqual({
      location: ["nms", "a"],
      options: { _: [] },
      errors: ['Missing required option "aa"'],
      rawLocation: ["nms"],
    });
    expect(
      parseArguments({ args: ["nms", "--aa", "aa-value"], definition: c.definition, cliOptions: c.options }),
    ).toStrictEqual({
      location: ["nms", "a"],
      options: { aa: "aa-value", _: [] },
      errors: [],
      rawLocation: ["nms"],
    });
    expect(parseArguments({ args: ["nms", "b"], definition: c.definition, cliOptions: c.options })).toStrictEqual({
      location: ["nms", "b"],
      options: { _: [] },
      errors: [],
      rawLocation: ["nms", "b"],
    });
    // With positional options
    c = new Cli({
      nms: {
        kind: "namespace",
        default: "a",
        options: { a: { kind: "command" }, b: { kind: "command" }, c: { kind: "option", positional: 0 } },
      },
    });
    expect(
      parseArguments({ args: ["nms", "opt-value"], definition: c.definition, cliOptions: c.options }),
    ).toStrictEqual({
      location: ["nms", "a"],
      options: { c: "opt-value", _: [] },
      errors: [],
      rawLocation: ["nms"],
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
    expect(parseArguments({ args: [], definition: c.definition, cliOptions: c.options })).toStrictEqual({
      options: expect.objectContaining({ _: [] }),
      location: [],
      errors: [],
      rawLocation: [],
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
    expect(parseArguments({ args: ["--opt", "optvalue"], definition: d, cliOptions })).toStrictEqual(
      expect.objectContaining({
        options: { opt: "optvalue-edited", test: "testvalue", _: [] },
        errors: [],
      }),
    );
  });
  it("Returns error if wrong namespace/command provided", () => {
    expect(parseArguments({ args: ["nms", "non-existent"], definition: def, cliOptions })).toStrictEqual(
      expect.objectContaining({
        errors: ['Command "non-existent" not found. Did you mean "cmd" ?', 'Unknown option "non-existent"'],
      }),
    );
  });
  it("Returns error if unknown options are found - without suggestion", () => {
    expect(
      parseArguments({ args: ["nms", "cmd", "cmdvalue", "unknown-option"], definition: def, cliOptions }),
    ).toStrictEqual(
      expect.objectContaining({
        errors: ['Unknown option "unknown-option"'],
      }),
    );
  });
  it("Returns error if unknown options are found - with suggestion", () => {
    expect(parseArguments({ args: ["nms", "cmd", "cmdvalue", "--opr"], definition: def, cliOptions })).toStrictEqual(
      expect.objectContaining({
        errors: ['Unknown option "--opr". Did you mean "--opt" ?'],
      }),
    );
  });
  it("Returns error if option has incorrect value", () => {
    expect(
      parseArguments({ args: ["nms", "cmd", "cmdvalue", "--opt", "true"], definition: def, cliOptions }),
    ).toStrictEqual(
      expect.objectContaining({
        errors: ['Wrong value for option "--opt". Expected <number> but found "true"'],
      }),
    );
  });
  it("Option alias should have preference over other option values", () => {
    expect(parseArguments({ args: ["nms", "cmd", "--opt", "1"], definition: def, cliOptions })).toStrictEqual(
      expect.objectContaining({
        options: { cmd: undefined, opt: 1, globalOption: "globalvalue", _: [] },
        errors: [],
      }),
    );
  });
  it("[Option.required] Return error if required option not provided", () => {
    const definition = new Cli({ opt: { required: true } }).definition;
    expect(parseArguments({ args: [], definition: definition as Definition, cliOptions })).toStrictEqual(
      expect.objectContaining({
        errors: ['Missing required option "opt"'],
      }),
    );
  });
  describe("Option.requires", () => {
    it("Return error if some key in option.requires not present", () => {
      const definition = new Cli({ opt: { requires: ["not-present-1", "not-present-2"] } }).definition;
      expect(
        parseArguments({ args: ["--opt", "optvalue"], definition: definition as Definition, cliOptions }),
      ).toStrictEqual(
        expect.objectContaining({
          errors: ['Missing dependencies for option "opt": opt->not-present-1, opt->not-present-2'],
        }),
      );
    });
    it("Error only reported if configured option is present", () => {
      const definition = new Cli({ opt: { requires: ["not-present-1", "not-present-2"] } }).definition;
      expect(parseArguments({ args: [], definition: definition as Definition, cliOptions })).toStrictEqual(
        expect.objectContaining({
          errors: [],
        }),
      );
    });
    it("Specify list using function", () => {
      const definition = new Cli({ opt: { requires: (v) => [(v as string).concat("__")] } }).definition;
      expect(
        parseArguments({ args: ["--opt", "optvalue"], definition: definition as Definition, cliOptions }),
      ).toStrictEqual(
        expect.objectContaining({
          location: [],
          errors: ['Missing dependencies for option "opt": opt->optvalue__'],
        }),
      );
    });
    it("Do not return error if all keys present", () => {
      const definition = new Cli({ opt: { requires: ["opt"] } }).definition;
      expect(
        parseArguments({ args: ["--opt", "optvalue"], definition: definition as Definition, cliOptions }),
      ).toStrictEqual(
        expect.objectContaining({
          location: [],
          errors: [],
          rawLocation: [],
        }),
      );
    });
  });
  it("Detect '--' delimiter", () => {
    const definition = new Cli(
      { nms: { options: { cmd: { options: { opt: {} } } } } },
      { help: { autoInclude: false }, version: { autoInclude: false } },
    ).definition;
    expect(
      parseArguments({
        args: ["nms", "cmd", "--opt", "optvalue", "--", "firstparam-a firstparam-b", "secondparam"],
        definition: definition as Definition,
        cliOptions,
      }),
    ).toStrictEqual({
      options: { opt: "optvalue", __: ["firstparam-a firstparam-b", "secondparam"], _: [] },
      location: ["nms", "cmd"],
      errors: [],
      rawLocation: ["nms", "cmd"],
    });
  });
  it('Unknown option is included in "_"', () => {
    const { definition, options } = new Cli({ cmd: { kind: "command" } }, { ...baseConfig, rootCommand: false });
    expect(
      parseArguments({ args: ["extra"], definition: definition as Definition, cliOptions: options }),
    ).toStrictEqual({
      options: { _: ["extra"] },
      location: [],
      errors: ['Command "extra" not found. Did you mean "cmd" ?', 'Unknown option "extra"'],
      rawLocation: [],
    });
  });
  it("Positional option (numerical)", () => {
    const { definition, options } = new Cli({ opt: { positional: 0 }, opt2: { positional: 1 } }, baseConfig);
    expect(
      parseArguments({
        args: ["optvalue", "opt2value", "extra"],
        definition: definition as Definition,
        cliOptions: options,
      }),
    ).toStrictEqual({
      options: { _: ["extra"], opt: "optvalue", opt2: "opt2value" },
      location: [],
      errors: ['Unknown option "extra"'],
      rawLocation: [],
    });
    expect(
      parseArguments({
        args: ["optvalue"],
        definition: { opt: { ...definition.opt, enum: ["optv1", "optv2"] } },
        cliOptions,
      }),
    ).toStrictEqual(
      expect.objectContaining({
        options: { _: [] },
        errors: ['Wrong value for option "opt". Expected \'optv1 | optv2\' but found "optvalue"'],
      }),
    );
  });
  it("Positional option (only numerical(-)) - does not capture due to missing positional.true", () => {
    const { definition, options } = new Cli(
      { optLast: { positional: -1 }, optPrevLast: { positional: -2 } },
      baseConfig,
    );
    expect(
      parseArguments({
        args: ["extra", "opt-prev-last", "opt-last"],
        definition: definition as Definition,
        cliOptions: options,
      }),
    ).toStrictEqual({
      options: { _: ["extra", "opt-prev-last", "opt-last"] },
      location: [],
      errors: ['Unknown option "extra"', 'Unknown option "opt-prev-last"', 'Unknown option "opt-last"'],
      rawLocation: [],
    });
  });
  it("Positional option (true + numerical(-))", () => {
    const { definition, options } = new Cli(
      { captureAll: { positional: true }, optLast: { positional: -1 }, optPrevLast: { positional: -2 } },
      baseConfig,
    );
    expect(
      parseArguments({
        args: ["capture-all", "opt-prev-last", "opt-last"],
        definition: definition as Definition,
        cliOptions: options,
      }),
    ).toStrictEqual({
      options: { _: [], captureAll: ["capture-all"], optLast: "opt-last", optPrevLast: "opt-prev-last" },
      location: [],
      errors: [],
      rawLocation: [],
    });
  });
  it("Positional option (true)", () => {
    const { definition, options } = new Cli({ opt: {}, popt: { positional: true } }, baseConfig);
    expect(
      parseArguments({
        args: ["--opt", "optvalue", "extra", "--opt", "optvalue2", "extra2", "--popt", "extra3"],
        definition: definition as Definition,
        cliOptions: options,
      }),
    ).toStrictEqual({
      options: { _: [], opt: "optvalue2", popt: ["extra", "extra2", "extra3"] },
      location: [],
      errors: [],
      rawLocation: [],
    });
  });
  it("Positional option (numerical(+) & true) - numerical(+) has precendence", () => {
    const { definition, options } = new Cli({ opt: { positional: true }, opt2: { positional: 1 } }, baseConfig);
    expect(
      parseArguments({
        args: ["optvalue", "opt2value", "optvalue2"],
        definition: definition as Definition,
        cliOptions: options,
      }),
    ).toStrictEqual({
      options: { _: [], opt: ["optvalue", "optvalue2"], opt2: "opt2value" },
      location: [],
      errors: [],
      rawLocation: [],
    });
  });
  it("Positional option (numerical(-) & true)", () => {
    const { definition, options } = new Cli(
      { captureAll: { positional: true }, optLast: { positional: -1 } },
      baseConfig,
    );
    expect(
      parseArguments({
        args: ["extra-1", "extra-2", "opt-last"],
        definition: definition as Definition,
        cliOptions: options,
      }),
    ).toStrictEqual({
      options: { _: [], captureAll: ["extra-1", "extra-2"], optLast: "opt-last" },
      location: [],
      errors: [],
      rawLocation: [],
    });
  });
  it("Positional option (numerical(-) & true) - single arg", () => {
    const { definition, options } = new Cli(
      { captureAll: { positional: true, required: true }, optLast: { positional: -1 } },
      baseConfig,
    );
    expect(
      parseArguments({
        args: ["opt-value"],
        definition: definition as Definition,
        cliOptions: options,
      }),
    ).toStrictEqual({
      options: { _: [], captureAll: ["opt-value"] },
      location: [],
      errors: [],
      rawLocation: [],
    });
  });
  it("Positional option (numerical) non-required - conflicting with alias", () => {
    const { definition, options } = new Cli({ opt: { positional: 0 }, regopt: { type: "boolean" } }, baseConfig);
    expect(
      parseArguments({ args: ["--regopt"], definition: definition as Definition, cliOptions: options }),
    ).toStrictEqual({
      options: { _: [], regopt: true },
      location: [],
      errors: [],
      rawLocation: [],
    });
  });
  it("Positional option (numerical) required - conflicting with alias", () => {
    const { definition, options } = new Cli(
      { opt: { positional: 0, required: true }, regopt: { type: "boolean" } },
      baseConfig,
    );
    expect(
      parseArguments({ args: ["--regopt"], definition: definition as Definition, cliOptions: options }),
    ).toStrictEqual({
      options: { _: [], regopt: true },
      location: [],
      errors: ['Missing required option "opt"'],
      rawLocation: [],
    });
  });
  it("Multiple non-required positional options (numerical) - conflicting with alias", () => {
    const { definition, options } = new Cli(
      { opt1: { positional: 0 }, opt2: { positional: 1 }, regopt: { type: "boolean" } },
      baseConfig,
    );
    expect(
      parseArguments({ args: ["--regopt", "false"], definition: definition as Definition, cliOptions: options }),
    ).toStrictEqual({
      options: { _: [], regopt: false },
      location: [],
      errors: [],
      rawLocation: [],
    });
  });
  it("Asigning positional option via alias", () => {
    const { definition, options } = new Cli({ opt: { positional: 0 }, regopt: { type: "boolean" } }, baseConfig);
    expect(
      parseArguments({
        args: ["--regopt", "--opt", "optvalue"],
        definition: definition as Definition,
        cliOptions: options,
      }),
    ).toStrictEqual({
      options: { _: [], regopt: true, opt: "optvalue" },
      location: [],
      errors: [],
      rawLocation: [],
    });
  });
  it("Positional option inside command's options", () => {
    const { definition, options } = new Cli({ cmd: { options: { opt: { positional: 0 }, regopt: {} } } }, baseConfig);
    expect(
      parseArguments({
        args: ["cmd", "optvalue", "--regopt", "regoptvalue"],
        definition: definition as Definition,
        cliOptions: options,
      }),
    ).toStrictEqual({
      options: { _: [], regopt: "regoptvalue", opt: "optvalue" },
      location: ["cmd"],
      errors: [],
      rawLocation: ["cmd"],
    });
  });
  it("Parse {long-alias}={value}", () => {
    const { definition, options } = new Cli({ opt: {}, opt2: {} }, baseConfig);
    expect(
      parseArguments({
        args: ["--opt=optvalue", "--opt2", "opt2value"],
        definition: definition as Definition,
        cliOptions: options,
      }),
    ).toStrictEqual({
      options: { _: [], opt: "optvalue", opt2: "opt2value" },
      location: [],
      errors: [],
      rawLocation: [],
    });
  });
  it("Parse {short-alias}{value}", () => {
    const { definition, options } = new Cli({ opt: { aliases: ["o"] }, opt2: {} }, baseConfig);
    expect(
      parseArguments({
        args: ["-ooptvalue", "--opt2", "opt2value"],
        definition: definition as Definition,
        cliOptions: options,
      }),
    ).toStrictEqual({
      options: { _: [], opt: "optvalue", opt2: "opt2value" },
      location: [],
      errors: [],
      rawLocation: [],
    });
  });
  it("Parse multiple boolean short flags", () => {
    const { definition, options } = new Cli(
      { a: { type: "boolean" }, b: { type: "boolean" }, c: { type: "boolean" } },
      baseConfig,
    );
    expect(parseArguments({ args: ["-abc"], definition: definition as Definition, cliOptions: options })).toStrictEqual(
      {
        options: { _: [], a: true, b: true, c: true },
        location: [],
        errors: [],
        rawLocation: [],
      },
    );
    expect(
      parseArguments({ args: ["-cbac"], definition: definition as Definition, cliOptions: options }),
    ).toStrictEqual({
      options: { _: [], a: true, b: true, c: true },
      location: [],
      errors: [],
      rawLocation: [],
    });
    // Repeated aliases
    expect(
      parseArguments({ args: ["-abca"], definition: definition as Definition, cliOptions: options }),
    ).toStrictEqual({
      options: { _: [], a: true, b: true, c: true },
      location: [],
      errors: [],
      rawLocation: [],
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
  it("Only autoincluded options: [OPTIONS] is not included", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    const noOptsDef = { nms: { options: { cmd: { options: { opt: {} } } } } };
    generateScopedHelp(new Cli(noOptsDef).definition, [], cliOptions);
    expect(output).toBe(`
Usage:  cli-name NAMESPACE

cli-description

Namespaces:
  nms         -

Options:
  -h, --help  Display global help, or scoped to a namespace/command

`);
  });
  it("Only autoincluded + positional options: [OPTIONS] is not included", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    const optsDef = {
      nms: { options: { cmd: { options: { opt: {} } } } },
      g1: { positional: 0 },
      g2: { positional: true },
    };
    generateScopedHelp(new Cli(optsDef).definition, [], cliOptions);
    expect(output).toBe(`
Usage:  cli-name NAMESPACE [g1] [g2...]

cli-description

Namespaces:
  nms         -

Options:
  --g1        -
  --g2        -
  -h, --help  Display global help, or scoped to a namespace/command

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
      nms: { kind: "namespace", aliases: ["nms"], key: "nms" },
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
  it("With custom `usage`", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    const def: Definition<DefinitionElement> = {
      cmd: { kind: "command", usage: "Custom Usage" },
      opt: { aliases: ["--opt"], kind: "option", type: "boolean", hidden: true },
    };
    generateScopedHelp(def, ["cmd"], cliOptions);
    expect(output).toStrictEqual(
      expect.stringContaining(`
Usage:  cli-name Custom Usage
`),
    );
  });
  it("With options", () => {
    let output = "";
    logger.mockImplementation((m: any) => !!(output += m));
    const { definition: def } = new Cli({
      bool: { type: "boolean", default: true, description: "boolean option" },
      negatable: { type: "boolean", negatable: true, description: "negatable option" },
      num: { type: "number", default: 10, enum: [1, 10, 50], description: "number option" },
      float: { type: "float", default: 0.5, enum: [0.1, 0.3, 0.5], description: "float option" },
      list: { type: "list", default: ["one", "two"], description: "list option" },
      listempty: { type: "list", default: [], description: "list - empty default" },
      enum: { enum: ["opt1", "opt2"], description: "string with enum" },
      enumdef: { enum: ["opt1", "opt2"], default: "opt1", description: "string with enum and default" },
      arg1: { positional: 0, required: true, description: "first positional mandatory option" },
      arg2: { positional: 1, description: "second positional option" },
      arg3: { positional: true, description: "catch-all positional option" },
      arg4: { positional: -2, description: "prev-last positional option" },
      arg5: { positional: -1, description: "last positional option" },
    });
    generateScopedHelp(def, [], cliOptions);
    expect(output).toStrictEqual(`
Usage:  cli-name [OPTIONS] <arg1> [arg2] [arg3...] [arg4] [arg5]

cli-description

Options:
  --bool           boolean option (default: true)
  --(no)negatable  negatable option
  --num            number option (allowed: [1, 10, 50], default: 10)
  --float          float option (allowed: [0.1, 0.3, 0.5], default: 0.5)
  --list           list option (default: ["one", "two"])
  --listempty      list - empty default (default: [])
  --enum           string with enum (allowed: ["opt1", "opt2"])
  --enumdef        string with enum and default (allowed: ["opt1", "opt2"], default: "opt1")
  --arg1           first positional mandatory option
  --arg2           second positional option
  --arg3           catch-all positional option
  --arg4           prev-last positional option
  --arg5           last positional option
  -h, --help       Display global help, or scoped to a namespace/command

`);
  });
  describe("Positional options", () => {
    it("non-negative numbers - without additional options", () => {
      let output = "";
      logger.mockImplementation((m: any) => !!(output += m));
      const { definition: def } = new Cli({
        arg1: { positional: 0, required: true },
        arg2: { positional: 1 },
      });
      generateScopedHelp(def, [], cliOptions);
      expect(output).toContain("Usage:  cli-name <arg1> [arg2]");
    });
    it("non-negative numbers - with additional options: opt-hint placed at the end", () => {
      let output = "";
      logger.mockImplementation((m: any) => !!(output += m));
      const { definition: def } = new Cli({
        arg1: { positional: 0, required: true },
        arg2: { positional: 1 },
        opt: {},
      });
      generateScopedHelp(def, [], cliOptions);
      expect(output).toContain("Usage:  cli-name <arg1> [arg2] [OPTIONS]");
    });
    it("negative numbers with additional options: opt-hint placed at the beggining", () => {
      let output = "";
      logger.mockImplementation((m: any) => !!(output += m));
      const { definition: def } = new Cli({
        arg1: { positional: -2, required: true },
        arg2: { positional: -1 },
        opt: {},
      });
      generateScopedHelp(def, [], cliOptions);
      expect(output).toContain("Usage:  cli-name [OPTIONS] <arg1> [arg2]");
    });
    it("[USER_ERROR] both negative and positive numbers with additional options: opt-hint placed at the beggining", () => {
      let output = "";
      logger.mockImplementation((m: any) => !!(output += m));
      const { definition: def } = new Cli({
        arg1: { positional: 1, required: true },
        arg2: { positional: -1 },
        opt: {},
      });
      generateScopedHelp(def, [], cliOptions);
      expect(output).toContain("Usage:  cli-name [OPTIONS] <arg1> [arg2]");
    });
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
