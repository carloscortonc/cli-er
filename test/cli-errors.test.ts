import { CliError, ErrorType } from "../src/cli-errors";

describe("CliErrors.format", () => {
  it("Formats ErrorType with a single argument", () => {
    expect(CliError.format(ErrorType.OPTION_NOT_FOUND, "option-name")).toEqual('Unknown option "option-name"');
  });
  it("Formats ErrorType with multiple arguments", () => {
    expect(CliError.format(ErrorType.COMMAND_NOT_FOUND, "cmd", "alternative")).toEqual(
      'Command "cmd" not found. Did you mean "alternative" ?'
    );
  });
});

describe("CliErrors.analize", () => {
  it("Returns undefined if no value is provided", () => {
    expect(CliError.analize(undefined)).toBe(undefined);
  });
  it("Returns undefined if no error-message is matched", () => {
    expect(CliError.analize("unknown-error")).toBe(undefined);
  });
  it("Returns the correct error type for a given existing error message", () => {
    expect(CliError.analize('Unknown option "option-name"')).toBe(ErrorType.OPTION_NOT_FOUND);
  });
});
