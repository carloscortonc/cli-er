import { describe, test, expect } from "tstyche";
import { defineCommand, CommandOptions } from "../src/extract-options-type";

describe("defineCommand", () => {
  test("should return the option-value type of its option", () => {
    const cmd = defineCommand({
      options: {
        number: { type: "number" },
        float: { type: "float" },
        boolean: { type: "boolean" },
        list: { type: "list" },
      },
    });
    expect<CommandOptions<typeof cmd>>().type.toEqual<{
      number: number;
      float: number;
      boolean: boolean;
      list: string[];
    }>;
  });
  test("return `never` if no options are present", () => {
    const cmd = defineCommand({
      options: undefined,
    });
    expect<CommandOptions<typeof cmd>>().type.toEqual<never>;
  });
});
