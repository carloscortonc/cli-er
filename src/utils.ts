import mergeWith from "lodash.mergewith";
import lodashclone from "lodash.clonedeep";
import Cli from ".";
import { CliOptions } from "./types";
import path from "path";
import fs from "fs";

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
export const logErrorAndExit = (...message: any[]) => {
  Cli.logger.error(...message, "\n");
  process.exit(1);
};

/** Merge two objects using lodash mergeWith, customizing array-merge */
export function merge(objValue: object, srcValue: object) {
  function customizer(a: object, b: object) {
    if (Array.isArray(a)) {
      return b;
    }
  }
  mergeWith(objValue, srcValue, customizer);
}

/** Find the package.json of the application that is using this library
 * Returns the content of the nearest package.json. The search goes from `CliOptions.baseLocation` up */
export function findPackageJson(options: CliOptions) {
  // Split baseLocation into the composing directories
  const parts = options.baseLocation?.split(new RegExp(`(?!^)${path.sep == "\\" ? path.sep.repeat(2) : path.sep}`)) || [];
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
