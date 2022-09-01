import mergeWith from "lodash.mergewith";
import lodashclone from "lodash.clonedeep";

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

/** Utility class for generating consistent logs. Space for improvement and customization */
export class Logger {
  static raw = (message: string) => process.stdout.write(message);
  static log = (...message: any[]) => console.log(...message);
  static error = (...message: any[]) => this.log("ERROR", ...message);
}

/** Merge two objects using lodash mergeWith, customizing array-merge */
export function merge(objValue: object, srcValue: object) {
  function customizer(a: object, b: object) {
    if (Array.isArray(a)) {
      return b;
    }
  }
  mergeWith(objValue, srcValue, customizer);
}
