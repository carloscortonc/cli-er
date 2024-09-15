import {
  CLIER_DEBUG_KEY,
  DEBUG_TYPE,
  clone,
  debug,
  deprecationWarning,
  findPackageJson,
  merge,
  findFile,
} from "../src/utils";
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
  process.exitCode = 0;
});

describe("findFile", () => {
  it("[windows] Checks all directories from 'start' upwards", () => {
    mockPath.sep = "\\";
    const pkgjson = findFile("C:\\start\\location\\path", ["file.json"]);
    expect((fs.existsSync as any).mock.calls).toEqual([
      ["C:\\start\\location\\path\\file.json"],
      ["C:\\start\\location\\file.json"],
      ["C:\\start\\file.json"],
      ["C:\\file.json"],
    ]);
    // Returns undefined if no package.json found
    expect(pkgjson).toBe(undefined);
  });
  it("[unix] Checks all directories from 'start' upwards", () => {
    mockPath.sep = "/";
    const pkgjson = findFile("/start/location", [".rpirc", ".rpirc.json"]);
    expect((fs.existsSync as any).mock.calls).toEqual([
      ["/start/location/.rpirc"],
      ["/start/location/.rpirc.json"],
      ["/start/.rpirc"],
      ["/start/.rpirc.json"],
    ]);
    // Returns undefined if no file found
    expect(pkgjson).toBe(undefined);
  });
  it("Returns the first file found", () => {
    const mockReadFile = (path: string) =>
      ({
        "/start/location/path/rpirc.json": undefined,
        "/start/location/rpirc.json": '{"name": "location-config"}',
        "/start/rpirc.json": '{"name": "base-config"}',
      }[path]);

    (fs.existsSync as jest.Mock).mockImplementation(mockReadFile);
    (fs.readFileSync as jest.Mock).mockImplementation(mockReadFile);
    const file = findFile("/start/location/path", ["rpirc.json"]);
    expect(file).toStrictEqual("/start/location/rpirc.json");
  });
});

describe("findPackageJson", () => {
  const baseLocation = "/base/location/path";

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
  const stdout = jest.spyOn(process.stdout, "write").mockImplementation(jest.fn());
  beforeEach(() => {
    stdout.mockClear();
  });
  afterAll(() => {
    stdout.mockReset();
  });
  it("Invokes process.stdout.write if debug is enabled: WARN", () => {
    process.env[CLIER_DEBUG_KEY] = "1";
    debug(DEBUG_TYPE.WARN, "debug-message");
    expect(stdout).toHaveBeenCalledWith("[CLIER_DEBUG::WARN] debug-message\n");
    expect(process.exitCode).toBe(1);
  });
  it("Invokes process.stdout.write if debug is enabled: TRACE", () => {
    process.env[CLIER_DEBUG_KEY] = "1";
    debug(DEBUG_TYPE.TRACE, "trace-message");
    expect(stdout).toHaveBeenCalledWith("[CLIER_DEBUG::TRACE] trace-message\n");
    expect(process.exitCode).toBe(0);
  });
  it("Does nothing if debug is disabled", () => {
    process.env[CLIER_DEBUG_KEY] = "";
    debug(DEBUG_TYPE.WARN, "debug-message");
    expect(stdout).not.toHaveBeenCalled();
  });
});

describe("deprecationWarning", () => {
  it("Log a given deprecation if condition is true", () => {
    process.env[CLIER_DEBUG_KEY] = "1"; // enable debug mode
    const stdout = jest.spyOn(process.stdout, "write").mockImplementation(jest.fn());
    deprecationWarning({ condition: true, property: "P", version: "1.0.0" });
    expect(stdout).toHaveBeenCalledWith(expect.stringContaining(`<P> is deprecated and will be removed in 1.0.0`));
    // Repeated deprecation will not be logged again
    stdout.mockClear();
    deprecationWarning({ condition: true, property: "P", version: "1.0.0" });
    expect(stdout).not.toHaveBeenCalled();
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

describe("clone", () => {
  it("Primitives", () => {
    const orig = { a: 1, b: "2", c: true, d: { nested: "1", undef: undefined, n: null } };
    const c = clone(orig);
    expect(c).toEqual({ a: 1, b: "2", c: true, d: { nested: "1", undef: undefined, n: null } });
    expect(c !== orig).toBeTruthy();
    orig.a = 2;
    orig.b = "3";
    orig.c = false;
    orig.d.nested = "2";
    expect(c).toEqual({ a: 1, b: "2", c: true, d: { nested: "1", undef: undefined, n: null } });
  });
  it("Array", () => {
    const orig = { array: new Array(1, 2, 3) };
    const c = clone(orig);
    expect(c.array instanceof Array).toBeTruthy();
    expect(c.array !== orig.array).toBeTruthy();
    expect(c.array).toStrictEqual([1, 2, 3]);
    orig.array.push(4);
    expect(c.array.length).toBe(3);
  });
  it("Set", () => {
    const orig = { set: new Set([1, 2, 3]) };
    const c = clone(orig);
    expect(c.set instanceof Set).toBeTruthy();
    expect(c.set !== orig.set).toBeTruthy();
    expect([...c.set]).toStrictEqual([1, 2, 3]);
    orig.set.add(4);
    expect([...c.set].length).toBe(3);
  });
  it("Map", () => {
    const orig = { map: new Map([["key", "value"]]) };
    const c = clone(orig);
    expect(c.map instanceof Map).toBeTruthy();
    expect(c.map !== orig.map).toBeTruthy();
    expect([...c.map.entries()]).toStrictEqual([["key", "value"]]);
    orig.map.set("key2", "value2");
    expect([...c.map.entries()].length).toBe(1);
  });
  it("Nested", () => {
    const orig: any = {
      a1: { a2: { set: new Set(["setvalue"]) }, array: [1, true, { map: new Map([["key", { v: "value" }]]) }] },
      b1: { b2: {} },
    };
    const c = clone(orig);
    expect(c).toStrictEqual({
      a1: { a2: { set: new Set(["setvalue"]) }, array: [1, true, { map: new Map([["key", { v: "value" }]]) }] },
      b1: { b2: {} },
    });
    expect(c !== orig).toBeTruthy();
    orig.a1.a2.set.add("anothervalue");
    orig.a1.array.push(2);
    orig.a1.array[2].map.get("key").v = "newvalue";
    expect([...c.a1.a2.set].length).toBe(1);
    expect(c.a1.array.length).toBe(3);
    expect(c.a1.array[2].map.get("key").v).toBe("value");
  });
});
