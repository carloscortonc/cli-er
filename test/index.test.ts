import Cli from "../src/index";
import * as cliutils from "../src/cli-utils";
import * as utils from "../src/utils";
import definition from "./data/definition.json";

jest.spyOn(cliutils, "getEntryPoint").mockImplementation(() => "require.main.filename");

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
      extension: "js",
      baseLocation: "require.main.filename",
      baseScriptLocation: "require.main.filename",
      commandsPath: "commands",
      help: {
        autoInclude: true,
        aliases: ["-h", "--help"],
        description: "Display global help, or scoped to a namespace/command",
        showOnFail: true,
      },
      version: {
        autoInclude: true,
        aliases: ["-v", "--version"],
        description: "Display version",
      },
    });
  });
  it("CliOptions are the result of merging default and provided options when instantiating with options", () => {
    const overrides = {
      baseLocation: "..",
      baseScriptLocation: "./",
      help: { autoInclude: false, aliases: ["--help"], description: "" },
      version: { aliases: ["--version"], description: "" },
    };
    const c = new Cli({}, overrides);
    expect(c.options).toStrictEqual({
      extension: "js",
      baseLocation: overrides.baseLocation,
      baseScriptLocation: overrides.baseScriptLocation,
      commandsPath: "commands",
      help: {
        autoInclude: overrides.help.autoInclude,
        aliases: ["--help"],
        description: "",
        showOnFail: true,
      },
      version: {
        autoInclude: true,
        aliases: ["--version"],
        description: "",
      },
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
  it("Calling run with no args prints error", () => {
    const spy = jest.spyOn(utils.Logger, "error");
    const c = new Cli(definition, { help: { autoInclude: false, showOnFail: false } });
    c.run([]);
    expect(spy).toHaveBeenCalledWith("No location provided to execute the script");
  });
  it("Calling run with arguments invokes the script in the computed location", () => {
    const spy = jest.spyOn(cliutils, "executeScript").mockImplementation();
    const c = new Cli(definition);
    c.run(["nms", "cmd"]);
    expect(spy.mock.calls[0][0]).toStrictEqual({
      location: ["nms", "cmd"],
      options: { cmd: undefined, globalOption: "globalvalue", opt: undefined },
    });
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
  });
  it("Calling run with version option invokes version-formatting", () => {
    const spy = jest.spyOn(cliutils, "formatVersion").mockImplementation();
    const c = new Cli(definition);
    c.run(["--version"]);
    expect(spy).toHaveBeenCalledWith(expect.anything());
  });
});
