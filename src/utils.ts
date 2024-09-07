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
    return value.padEnd(this.maxLengths[id] + additionalSpacing, " ");
  }
}

/** Add line-breaks to the provided string, taking into account tty columns and start param */
export function addLineBreaks(value: string, params: { start: number; rightMargin?: number; indent?: number }) {
  const { start, rightMargin = 2, indent = 1 } = params;
  const width = process.stdout.columns;
  const availableWidth = width - start - rightMargin;
  if (!width || availableWidth <= 0) {
    // Nothing can be done
    return value.concat("\n");
  }
  // prettier-ignore
  let remaining = value, extra = 0, lines = [];
  while (remaining.length > availableWidth) {
    const chunk =
      // Break by the last space present
      /.+[ ]/.exec(remaining.slice(0, availableWidth))?.[0] ||
      // If no spaces are present to split the word, use "-"
      (() => {
        extra = 1;
        return remaining.slice(0, availableWidth - 1).concat("-");
      })();
    lines.push(chunk);
    remaining = remaining.slice(chunk.length - extra);
    extra = 0;
  }
  lines.push(remaining);
  return lines.join(`\n${" ".repeat(start + indent)}`).concat("\n");
}

/** Add single/doble quotes to a given string */
export const quote = (e: string, q: "'" | '"' = '"') => "".concat(q, e, q);

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

/** Find the version of this library */
export function getClierVersion() {
  const location = path.join(__dirname, "..", "package.json");
  try {
    return JSON.parse(fs.readFileSync(location, "utf-8")).version;
  } catch {
    return undefined;
  }
}

export const isDebugActive = () => process.env[CLIER_DEBUG_KEY];

export enum DEBUG_TYPE {
  /** Used for deprecations, definition warnings, etc */
  WARN = "WARN",
  /** Used for debugging execution */
  TRACE = "TRACE",
}

/** Utility to print messages only when debug mode is active
 * This will set the process exitcode to 1 */
export function debug(type: `${DEBUG_TYPE}`, message: string) {
  //TODO implement as a singleton with strategy ptrn
  if (isDebugActive()) {
    process.stdout.write(`[CLIER_DEBUG::${type}] `.concat(message, "\n"));
    // Only set error exitcode with warn debug-messages
    type === DEBUG_TYPE.WARN && (process.exitCode = 1);
  }
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
    if (!isDebugActive() || options.condition === false) {
      return;
    }
    const depMessage = `<${options.property}> is deprecated`.concat(
      options.version ? ` and will be removed in ${options.version}` : "",
      options.alternative ? `. Use <${options.alternative}> instead` : "",
      options.description ? ". ".concat(options.description) : "",
    );
    if (!this.list.has(depMessage)) {
      this.list.add(depMessage);
      debug(DEBUG_TYPE.WARN, depMessage);
    }
  };
}

/** Method for logging deprecation warnings */
export const deprecationWarning = new DeprecationWarning().deprecate;
