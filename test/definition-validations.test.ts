import { clierdebug, DEBUG_TYPE } from "../src/debug-logger";
import { validatePositional } from "../src/definition-validations";

jest.mock("../src/utils", () => ({
  ...jest.requireActual("../src/utils"),
  isDebugActive: () => true,
}));

jest.mock("../src/debug-logger", () => ({
  ...jest.requireActual("../src/debug-logger"),
  clierdebug: jest.fn(),
}));

describe("validatePositional", () => {
  beforeEach(() => {
    (clierdebug as jest.Mock).mockClear();
  });
  it("Valid (positive)", () => {
    validatePositional([
      { key: "opt", positional: 0 },
      { key: "opt-2", positional: 1 },
    ]);
    expect(clierdebug).not.toHaveBeenCalled();
  });
  it("Duplicated positional", () => {
    validatePositional([
      { key: "opt", positional: 1 },
      { key: "opt-2", positional: 1 },
    ]);
    expect(clierdebug).toHaveBeenCalledWith("Duplicated Option.positional value <1> in option opt-2", DEBUG_TYPE.WARN);
  });
  it("Missing positional (positive values)", () => {
    validatePositional([
      { key: "opt", positional: 1 },
      { key: "opt-2", positional: 3 },
    ]);
    expect(clierdebug).toHaveBeenCalledWith(
      "Missing correlative positional value <0> in options: opt,opt-2",
      DEBUG_TYPE.WARN,
    );
  });
  it("Valid (negative values)", () => {
    validatePositional([{ key: "opt", positional: -1 }]);
    expect(clierdebug).not.toHaveBeenCalled();
  });
  it("Missing positional (negative values)", () => {
    validatePositional([
      { key: "opt", positional: -2 },
      { key: "opt-2", positional: -4 },
    ]);
    expect(clierdebug).toHaveBeenCalledWith(
      "Missing correlative positional value <-1> in options: opt,opt-2",
      DEBUG_TYPE.WARN,
    );
  });
});
