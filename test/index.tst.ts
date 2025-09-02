import { describe, test, expect } from "tstyche";
import { defineCommand, defineNamespace, CommandOptions, NamespaceOptions } from "../src/extract-options-type";

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
    expect<CommandOptions<typeof cmd>>().type.toBe<{
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
    expect<CommandOptions<typeof cmd>>().type.toBe<{
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
    expect<CommandOptions<typeof cmd>>().type.toBe<{
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
    expect<CommandOptions<typeof cmd>>().type.toBe<never>();
  });
});

describe("defineNamespace", () => {
  test("single command", () => {
    const nms = defineNamespace({
      options: { cmd: { kind: "command", options: { cmdOpt: { kind: "option", type: "string" } } } },
    });
    expect<NamespaceOptions<typeof nms>>().type.toBe<{ cmd: { cmdOpt: string | undefined } }>();
  });
  test("nested namespace", () => {
    const nms = defineNamespace({
      options: {
        nms: {
          kind: "namespace",
          options: { cmd: { kind: "command", options: { cmdOpt: { kind: "option", type: "string" } } } },
        },
      },
    });
    expect<NamespaceOptions<typeof nms>>().type.toBe<{ nms: { cmd: { cmdOpt: string | undefined } } }>();
  });
  test("include options for previous levels", () => {
    const nms = defineNamespace({
      options: {
        nms: {
          kind: "namespace",
          options: {
            nms_cmd: { kind: "command", options: { nmsCmdOpt: { kind: "option", type: "string" } } },
            nms_cmd2: { kind: "command", options: {} },
            nmsOpt: { kind: "option", type: "string" },
          },
        },
        cmd: { kind: "command", options: { cmdOpt: { kind: "option", type: "list" } } },
        globalOpt: { kind: "option", type: "number" },
      },
    });
    expect<NamespaceOptions<typeof nms>>().type.toBe<{
      nms: {
        nms_cmd: { nmsCmdOpt: string | undefined; nmsOpt: string | undefined; globalOpt: number | undefined };
        nms_cmd2: { nmsOpt: string | undefined; globalOpt: number | undefined };
      };
      cmd: {
        cmdOpt: string[] | undefined;
        globalOpt: number | undefined;
      };
    }>();
  });
});
