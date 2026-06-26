import { CLIER_DEBUG_KEY, DEBUG_TYPE } from "../src/debug-logger";

describe("clierdebug", () => {
  const stderr = jest.spyOn(console, "error").mockImplementation(jest.fn());
  beforeEach(() => {
    stderr.mockClear();
    jest.resetModules();
  });
  afterAll(() => {
    stderr.mockReset();
  });
  it("Invokes process.stdout.write if debug is enabled: WARN", async () => {
    process.env[CLIER_DEBUG_KEY] = "1";
    const { clierdebug } = await import("../src/debug-logger");
    clierdebug("debug-message", DEBUG_TYPE.WARN);
    expect(stderr).toHaveBeenCalledWith("[CLIER::WARN] debug-message");
    expect(process.exitCode).toBe(1);
  });
  it("Invokes process.stdout.write if debug is enabled: TRACE", async () => {
    process.exitCode = 0;
    process.env[CLIER_DEBUG_KEY] = "1";
    const { clierdebug } = await import("../src/debug-logger");
    clierdebug("trace-message", DEBUG_TYPE.TRACE);
    expect(stderr).toHaveBeenCalledWith("[CLIER::TRACE] trace-message");
    expect(process.exitCode).toBe(0);
  });
  it("Does nothing if debug is disabled", async () => {
    process.env[CLIER_DEBUG_KEY] = "";
    const { clierdebug } = await import("../src/debug-logger");
    clierdebug("debug-message", DEBUG_TYPE.WARN);
    expect(stderr).not.toHaveBeenCalled();
  });
});

describe("debug", () => {
  beforeEach(() => {
    jest.resetModules();
  });
  it("Enabled when provided exact namespace", async () => {
    process.env.DEBUG = "nms";
    const { debug } = await import("../src/debug-logger");
    const d = debug("nms");
    expect(d.enabled).toBe(true);
  });
  it("Enabled when provided '*'", async () => {
    process.env.DEBUG = "*";
    const { debug } = await import("../src/debug-logger");
    const d = debug("nms");
    expect(d.enabled).toBe(true);
  });
  it("Enabled when provided partial namespace + '*'", async () => {
    process.env.DEBUG = "nm*";
    const { debug } = await import("../src/debug-logger");
    const d = debug("nms");
    expect(d.enabled).toBe(true);
  });
  it("Enabled when provided inside comma-separated list", async () => {
    process.env.DEBUG = "another,nms";
    const { debug } = await import("../src/debug-logger");
    const d = debug("nms");
    expect(d.enabled).toBe(true);
  });
  it("Disabled with empty DEBUG", async () => {
    process.env.DEBUG = undefined;
    const { debug } = await import("../src/debug-logger");
    const d = debug("nms");
    expect(d.enabled).toBe(false);
  });
  it("Disabled with non-matching namespace", async () => {
    process.env.DEBUG = "nm";
    const { debug } = await import("../src/debug-logger");
    const d = debug("nms");
    expect(d.enabled).toBe(false);
  });
});
