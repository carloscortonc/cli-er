import { CLIER_DEBUG_KEY, clierdebug, DEBUG_TYPE } from "../src/debug-logger";

describe("debug", () => {
  const stdout = jest.spyOn(process.stderr, "write").mockImplementation(jest.fn());
  beforeEach(() => {
    stdout.mockClear();
  });
  afterAll(() => {
    stdout.mockReset();
  });
  it("Invokes process.stdout.write if debug is enabled: WARN", () => {
    process.env[CLIER_DEBUG_KEY] = "1";
    clierdebug("debug-message", DEBUG_TYPE.WARN);
    expect(stdout).toHaveBeenCalledWith("[CLIER_DEBUG::WARN] debug-message\n");
    expect(process.exitCode).toBe(1);
  });
  it("Invokes process.stdout.write if debug is enabled: TRACE", () => {
    process.env[CLIER_DEBUG_KEY] = "1";
    clierdebug("trace-message", DEBUG_TYPE.TRACE);
    expect(stdout).toHaveBeenCalledWith("[CLIER_DEBUG::TRACE] trace-message\n");
    expect(process.exitCode).toBe(0);
  });
  it("Does nothing if debug is disabled", () => {
    process.env[CLIER_DEBUG_KEY] = "";
    clierdebug("debug-message", DEBUG_TYPE.WARN);
    expect(stdout).not.toHaveBeenCalled();
  });
});
