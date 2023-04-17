import { CLIER_DEBUG_KEY, debug, deprecationWarning, findPackageJson } from "../src/utils";
import path from "path";
import fs from "fs";

jest.mock("fs", () => ({
  readFileSync: jest.fn(),
  existsSync: jest.fn(() => false),
}));
jest.mock("path", () => ({
  esModule: true,
  ...jest.requireActual("path"),
  resolve: (...parts: string[]) => parts.join(path.sep),
  sep: "/",
}));

const mockPath = path as { sep: string };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("findPackageJson", () => {
  const options = { baseLocation: "/base/location/path" };
  it("[windows] Checks all directories from baseLocation upwards", () => {
    mockPath.sep = "\\";
    const pkgjson = findPackageJson({ baseLocation: "C:\\base\\location\\path" } as any);
    expect((fs.existsSync as any).mock.calls).toEqual([
      ["C:\\base\\location\\path\\package.json"],
      ["C:\\base\\location\\package.json"],
      ["C:\\base\\package.json"],
      ["C:\\package.json"],
    ]);
    // Returns undefined if no package.json found
    expect(pkgjson).toBe(undefined);
  });
  it("[unix] Checks all directories from baseLocation upwards", () => {
    mockPath.sep = "/";
    const pkgjson = findPackageJson(options as any);
    expect((fs.existsSync as any).mock.calls).toEqual([
      ["/base/location/path/package.json"],
      ["/base/location/package.json"],
      ["/base/package.json"],
    ]);
    // Returns undefined if no package.json found
    expect(pkgjson).toBe(undefined);
  });
  it("Returns the first package.json found", () => {
    const mockReadFile = (path: string) =>
      ({
        "/base/location/path/package.json": undefined,
        "/base/location/package.json": '{"name": "location-package"}',
        "/base/package.json": '{"name": "base-package"}',
      }[path]);

    (fs.existsSync as jest.Mock).mockImplementation(mockReadFile);
    (fs.readFileSync as jest.Mock).mockImplementation(mockReadFile);
    const pkgjson = findPackageJson(options as any);
    expect(pkgjson).toStrictEqual({ name: "location-package" });
  });
  it("Returns undefined if an error is generated during parsing", () => {
    (fs.existsSync as jest.Mock).mockImplementation(() => true);
    (fs.readFileSync as jest.Mock).mockImplementation(() => "*{}");
    const pkgjson = findPackageJson(options as any);
    expect(pkgjson).toBe(undefined);
  });
});

describe("debug", () => {
  const stderr = jest.spyOn(process.stderr, "write").mockImplementationOnce(jest.fn());
  beforeEach(() => {
    stderr.mockClear();
  });
  afterAll(() => {
    stderr.mockReset();
  });
  it("Invokes process.stderr.write if debug is enabled", () => {
    process.env[CLIER_DEBUG_KEY] = "1";
    debug("debug-message");
    expect(stderr).toHaveBeenCalledWith("[CLIER_DEBUG] debug-message\n");
  });
  it("Does nothing if debug is disabled", () => {
    process.env[CLIER_DEBUG_KEY] = "";
    debug("debug-message");
    expect(stderr).not.toHaveBeenCalled();
  });
});

describe("deprecationWarning", () => {
  it("Log a given deprecation if condition is true", () => {
    process.env[CLIER_DEBUG_KEY] = "1"; // enable debug mode
    const stderr = jest.spyOn(process.stderr, "write").mockImplementation(jest.fn());
    deprecationWarning({ condition: true, property: "P", version: "1.0.0" });
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining(`<P> is deprecated and will be removed in 1.0.0`));
    // Repeated deprecation will not be logged again
    stderr.mockClear();
    deprecationWarning({ condition: true, property: "P", version: "1.0.0" });
    expect(stderr).not.toHaveBeenCalled();
  });
});
