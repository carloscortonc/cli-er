import Cli from "../src/index";
import * as cliutils from "../src/cli-utils";
import * as utils from "../src/utils";
import definition from "./data/definition.json";

jest.mock("path", () => ({
  ...jest.requireActual("path"),
  dirname: () => "require.main.filename",
}));

describe("Cli.constructor", () => {
  it("Resulting definition contains only default help when provided with empty definition and options.help.autoInclude is defaulted to true", () => {
    const c = new Cli({});
    expect(c.definition).toMatchObject({
      help: {
        type: "boolean",
        aliases: ["-h", "--help"],
        description: "Display global help, or scoped to a namespace/command",
      },
    });
  });
  it("Resulting definition contains only custom help when provided with empty definition and options.help.autoInclude is defaulted to true", () => {
    const c = new Cli({}, { help: { aliases: ["--custom-help"] } });
    expect(c.definition).toMatchObject({
      help: {
        type: "boolean",
        aliases: ["--custom-help"],
        description: "Display global help, or scoped to a namespace/command",
      },
    });
  });
  it("Resulting definition is an empty object when provided with empty definition and options.help.autoInclude is false", () => {
    const c = new Cli({}, { help: { autoInclude: false } });
    expect(c.definition).toStrictEqual({});
  });
  it("CliOptions are default when instantiating with no options", () => {
    const c = new Cli({});
    expect(c.options).toStrictEqual({
      extension: "js",
      baseScriptLocation: "require.main.filename",
      commandsPath: "commands",
      help: {
        autoInclude: true,
        aliases: ["-h", "--help"],
        showOnFail: true,
      },
    });
  });
  it("CliOptions are the result of merging default and provided options when instantiating with options", () => {
    const overrides = { baseScriptLocation: "./", help: { autoInclude: false, aliases: ["--help"] } };
    const c = new Cli({}, overrides);
    expect(c.options).toStrictEqual({
      extension: "js",
      baseScriptLocation: overrides.baseScriptLocation,
      commandsPath: "commands",
      help: {
        autoInclude: overrides.help.autoInclude,
        aliases: ["--help"],
        showOnFail: true,
      },
    });
  });
});

describe("Cli.parse", () => {
  it("Parsing empty array results in default values from first-level options (with autoincluded help)", () => {
    const c = new Cli(definition);
    const output = c.parse([]);
    expect(output).toStrictEqual({
      location: [],
      options: { globalOption: "globalvalue", help: undefined },
    });
  });
  it("Parsing empty array results in default values from first-level options (without autoincluded help)", () => {
    const c = new Cli(definition, { help: { autoInclude: false } });
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
    const spy = jest.spyOn(cliutils, "executeScript");
    const c = new Cli(definition);
    c.run(["nms", "cmd"]);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ location: ["nms", "cmd"] }),
      expect.anything(),
      expect.anything()
    );
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
});
