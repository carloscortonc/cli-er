import Cli from ".";
import path from "path";
import fs from "fs";

export const CLIER_DEBUG_KEY: string = "CLIER_DEBUG";

/** Basic implementation of an object deepclone algorithm.
 * Does not cover all cases (does not create new Integer, Float, Boolean, etc objects),
 * but does the essentials for our use case, including nested objects, arrays, maps and sets */
export const clone = (o: any): any => {
  if (o?.constructor?.name === "Map") {
    const m = new Map();
    for (const [k, v] of o.entries()) {
      m.set(k, clone(v));
    }
    return m;
  }
  if (o?.constructor?.name === "Set") {
    const m = new Set();
    for (const v of [...o]) {
      m.add(clone(v));
    }
    return m;
  }
  if (Array.isArray(o)) {
    return o.map(clone);
  }
  if (!isPlainObject(o)) {
    return o;
  }
  const m = {};
  for (const p of Object.keys(o)) {
    Object.assign(m, { [p]: clone(o[p]) });
  }
  return m;
};

/** Utility class to format column values to a fixed length */
export class ColumnFormatter {
  maxLengths: { [key: string]: number };
  constructor() {
    this.maxLengths = {};
    return this;
  }
  process(id: string, column: string[]) {
    this.maxLengths[id] = Math.max(...column.map((e) => e.length));
    return this;
  }
  format(id: string, value: string, additionalSpacing = 0) {
    return value.concat(" ".repeat(this.maxLengths[id] + additionalSpacing - value.length));
  }
}

/** Shortened method for logging an error an exiting */
export const logErrorAndExit = (message?: string) => {
  if (message) {
    Cli.logger.error(message, "\n");
  }
  process.exit(1);
};

type TObject = { [k: string]: any };

function isPlainObject(obj: any) {
  return typeof obj === "object" && obj !== null && obj.constructor === Object;
}

/** Simple implementation for merging all source objects into target.
 * Only properties enumerated in target may be overwritten */
export function merge(target: TObject, ...srcValues: TObject[]) {
  for (const key in target) {
    if (isPlainObject(target[key])) {
      merge(target[key], ...srcValues.map((s) => s[key]));
      continue;
    }
    Object.assign(
      target,
      ...srcValues.reduce((acc: TObject[], curr = {}) => {
        return [...acc, curr[key] !== undefined ? { [key]: curr[key] } : {}];
      }, []),
    );
  }
}

/** Find the package.json of the application that is using this library
 * Returns the content of the nearest package.json. The search goes from `CliOptions.baseLocation` up */
export function findPackageJson(baseLocation: string) {
  // Split baseLocation into the composing directories
  const parts = baseLocation?.split(new RegExp(`(?!^)${path.sep == "\\" ? path.sep.repeat(2) : path.sep}`)) || [];
  for (let len = parts.length; len > 0; len--) {
    const candidate = path.resolve(...parts.slice(0, len), "package.json");
    if (!fs.existsSync(candidate)) {
      continue;
    }
    try {
      return JSON.parse(fs.readFileSync(candidate, "utf-8"));
    } catch {
      // Error parsing package.json, return undefined
      break;
    }
  }
  return undefined;
}

export const isDebugActive = () => process.env[CLIER_DEBUG_KEY];

/** Utility to print messages only when debug mode is active */
export function debug(message: string) {
  isDebugActive() && process.stderr.write("[CLIER_DEBUG] ".concat(message, "\n"));
}

/** Class containing the logic for logging deprecations. It holds the list of deprecation-messages already
 * printed, to avoid duplicates */
class DeprecationWarning {
  list = new Set();
  deprecate = (options: {
    condition?: boolean;
    property?: string;
    version?: string;
    alternative?: string;
    description?: string;
  }) => {
    // Check if debug mode is active to avoid unnecessary execution
    if (!isDebugActive()) {
      return;
    }
    const depMessage = `<${options.property}> is deprecated`.concat(
      options.version ? ` and will be removed in ${options.version}` : "",
      options.alternative ? `. Use <${options.alternative}> instead` : "",
      options.description ? ". ".concat(options.description) : "",
    );
    if (options.condition !== false && !this.list.has(depMessage)) {
      this.list.add(depMessage);
      debug(depMessage);
    }
  };
}

/** Method for logging deprecation warnings */
export const deprecationWarning = new DeprecationWarning().deprecate;
