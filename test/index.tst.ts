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
        // Option.default should set a value, so resulting type should not be `undefined`
        def: { default: "value" },
        nonreq: { required: false },
      },
    });
    expect<CommandOptions<typeof cmd>>().type.toEqual<{
      req: string;
      def: string;
      nonreq: string | undefined;
    }>();
  });
  test("should take `Option.enum` into account", () => {
    const cmd = defineCommand({
      options: {
        string: { enum: ["str1", "str2"] as const, required: true },
        number: { type: "number", enum: [1, 5, 10] as const, required: true },
        float: { type: "float", enum: [0.5, 1.5, 5.5] as const, required: true },
        positional: { positional: 0, enum: ["pos1", "pos2"] as const, required: true },
        list: { type: "list", enum: ["elem1", "elem2"] as const, required: true },
      },
    });
    expect<CommandOptions<typeof cmd>>().type.toEqual<{
      string: "str1" | "str2";
      number: 1 | 5 | 10;
      float: 0.5 | 1.5 | 5.5;
      positional: "pos1" | "pos2";
      list: ("elem1" | "elem2")[];
    }>();
  });
  test("return `never` if no options are present", () => {
    const cmd = defineCommand({
      options: undefined,
    });
    expect<CommandOptions<typeof cmd>>().type.toEqual<never>();
  });
});
