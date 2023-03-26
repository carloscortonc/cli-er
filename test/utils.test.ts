import { findPackageJson } from "../src/utils";
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
