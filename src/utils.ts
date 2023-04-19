import lodashclone from "lodash.clonedeep";
import Cli from ".";
import { CliOptions } from "./types";
import path from "path";
import fs from "fs";

export const CLIER_DEBUG_KEY: string = "CLIER_DEBUG";

export const clone = (o: any) => lodashclone(o);

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

/** Simple implementation for merging all source objects into target */
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
export function findPackageJson(options: CliOptions) {
  // Split baseLocation into the composing directories
  const parts =
    options.baseLocation?.split(new RegExp(`(?!^)${path.sep == "\\" ? path.sep.repeat(2) : path.sep}`)) || [];
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

/** Utility to print messages only when debug mode is active */
export function debug(message: string) {
  process.env[CLIER_DEBUG_KEY] && process.stderr.write("[CLIER_DEBUG] ".concat(message, "\n"));
}

/** Class containing the logic for logging deprecations. It holds the list of deprecation-messages already
 * printed, to avoid duplicates */
class DeprecationWarning {
  list = new Set();
  deprecate = (options: { condition: boolean; property: string; version: string }) => {
    const depMessage = `<${options.property}> is deprecated and will be removed in ${options.version}`;
    if (options.condition && !this.list.has(depMessage)) {
      this.list.add(depMessage);
      debug(depMessage);
    }
  };
}

/** Method for logging deprecation warnings */
export const deprecationWarning = new DeprecationWarning().deprecate;
