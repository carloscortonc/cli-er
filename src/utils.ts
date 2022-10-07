import mergeWith from "lodash.mergewith";
import lodashclone from "lodash.clonedeep";
import Cli from ".";

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
