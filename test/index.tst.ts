import { describe, test, expect } from "tstyche";
import { defineCommand, CommandOptions } from "../src/extract-options-type";

describe("defineCommand", () => {
  test("should return the option-value type of its option", () => {
    const cmd = defineCommand({
      options: {
        number: { type: "number", required: true },
        float: { type: "float", required: true },
        boolean: { type: "boolean", required: true },
        list: { type: "list", required: true },
      },
    });
    expect<CommandOptions<typeof cmd>>().type.toEqual<{
      number: number;
      float: number;
      boolean: boolean;
      list: string[];
    }>();
  });
  test("should take `Option.required` into account", () => {
    const cmd = defineCommand({
      options: {
        req: { required: true },
        nonreq: { required: false },
      },
    });
    expect<CommandOptions<typeof cmd>>().type.toEqual<{
      req: string;
      nonreq: string | undefined;
    }>();
  });
  test("return `never` if no options are present", () => {
    const cmd = defineCommand({
      options: undefined,
    });
    expect<CommandOptions<typeof cmd>>().type.toEqual<never>();
  });
});
