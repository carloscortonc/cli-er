import { CLIER_DEBUG_KEY, debug, deprecationWarning, findPackageJson, merge } from "../src/utils";
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
  const baseLocation = "/base/location/path";
  it("[windows] Checks all directories from baseLocation upwards", () => {
    mockPath.sep = "\\";
    const pkgjson = findPackageJson("C:\\base\\location\\path");
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
    const pkgjson = findPackageJson(baseLocation);
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
    const pkgjson = findPackageJson(baseLocation);
    expect(pkgjson).toStrictEqual({ name: "location-package" });
  });
  it("Returns undefined if an error is generated during parsing", () => {
    (fs.existsSync as jest.Mock).mockImplementation(() => true);
    (fs.readFileSync as jest.Mock).mockImplementation(() => "*{}");
    const pkgjson = findPackageJson(baseLocation);
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

describe("merge", () => {
  it("Merge multiple objects into target", () => {
    const target = {
      p0: "p0-target",
      p1: "p1-target",
      p2: { p21: "p21-target" },
      p3: { p3p1: "p3p1-target", p3p2: "p3p2-target", p31: { p32p1: "p32p1-target", p32p2: "p32p2-target" } },
    };
    const source1 = { p0: undefined, p1: "p1-source1", p3: { p3p2: "p3p2-source1" } };
    const source2 = { p3: { p31: { p32p1: "p32p1-source2" } } };
    merge(target, source1, source2);
    expect(target).toStrictEqual({
      p0: "p0-target",
      p1: "p1-source1",
      p2: { p21: "p21-target" },
      p3: { p3p1: "p3p1-target", p3p2: "p3p2-source1", p31: { p32p1: "p32p1-source2", p32p2: "p32p2-target" } },
    });
  });
});
