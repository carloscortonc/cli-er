export const clone = (o: any) => JSON.parse(JSON.stringify(o));

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
  static log = (...message: any[]) => console.log(...message);
  static error = (...message: any[]) => this.log("ERROR", ...message);
}
