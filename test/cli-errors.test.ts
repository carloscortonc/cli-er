import { CliError, ERROR_MESSAGES } from "../src/cli-errors";
import Cli from "../src";

beforeAll(() => {
  Cli.messages = ERROR_MESSAGES as any;
});

describe("CliErrors.analize", () => {
  it("Returns undefined if no value is provided", () => {
    expect(CliError.analize(undefined)).toBe(undefined);
  });
  it("Returns undefined if no error-message is matched", () => {
    expect(CliError.analize("unknown-error")).toBe(undefined);
  });
  it("Returns the correct error type for a given existing error message", () => {
    expect(CliError.analize('Unknown option "option-name"')).toBe("option_not_found");
  });
});
