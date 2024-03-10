import { Definition, Command, Option } from "./types";

/** Defines the final option-value type based on Option.type */
type OptionsTypes<T extends Definition<Option>> = {
  [K in keyof T]: MaybeOptional<
    T[K]["enum"] extends readonly any[]
      ? T[K]["type"] extends "list"
        ? T[K]["enum"][number][]
        : T[K]["enum"][number]
      : T[K]["type"] extends "number" | "float"
      ? number
      : T[K]["type"] extends "boolean"
      ? boolean
      : T[K]["type"] extends "list"
      ? string[]
      : T[K]["positional"] extends true
      ? string[]
      : string,
    T[K]
  >;
};

/** Take into account Option.required and Option.default for defining T value */
type MaybeOptional<T, O extends Option> = O["required"] extends true
  ? T
  : O extends { default: any }
  ? T
  : T | undefined;

export type CommandOptions<T extends Omit<Command, "kind">> = T["options"] extends { [key: string]: any }
  ? OptionsTypes<T["options"]>
  : never;

/** Utility to define a command for extracting its options type, while still having IntelliSense
 *
 * Example:
 * ```
 * const cmd = defineCommand({ options: { somelist: { type: "list" } }});
 * type CmdOptions = CommandOptions<typeof cmd>
 * // CmdOptions: { somelist: string[] }
 * ```
 */
export const defineCommand = <T extends Omit<Command, "kind">>(c: T): T => Object.assign(c, { kind: "command" });
