import { validatePositional } from "../src/definition-validations";
import { debug, DEBUG_TYPE } from "../src/utils";

jest.mock("../src/utils", () => ({
  ...jest.requireActual("../src/utils"),
  isDebugActive: () => true,
  debug: jest.fn(),
}));

describe("validatePositional", () => {
  beforeEach(() => {
    (debug as jest.Mock).mockClear();
  });
  it("Valid (positive)", () => {
    validatePositional([
      { key: "opt", positional: 0 },
      { key: "opt-2", positional: 1 },
    ]);
    expect(debug).not.toHaveBeenCalled();
  });
  it("Duplicated positional", () => {
    validatePositional([
      { key: "opt", positional: 1 },
      { key: "opt-2", positional: 1 },
    ]);
    expect(debug).toHaveBeenCalledWith(DEBUG_TYPE.WARN, "Duplicated Option.positional value <1> in option opt-2");
  });
  it("Missing positional (positive values)", () => {
    validatePositional([
      { key: "opt", positional: 1 },
      { key: "opt-2", positional: 3 },
    ]);
    expect(debug).toHaveBeenCalledWith(
      DEBUG_TYPE.WARN,
      "Missing correlative positional value <0> in options: opt,opt-2",
    );
  });
  it("Valid (negative values)", () => {
    validatePositional([{ key: "opt", positional: -1 }]);
    expect(debug).not.toHaveBeenCalled();
  });
  it("Missing positional (negative values)", () => {
    validatePositional([
      { key: "opt", positional: -2 },
      { key: "opt-2", positional: -4 },
    ]);
    expect(debug).toHaveBeenCalledWith(
      DEBUG_TYPE.WARN,
      "Missing correlative positional value <-1> in options: opt,opt-2",
    );
  });
});
