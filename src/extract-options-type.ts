import { Definition, Command, Option, Namespace } from "./types";

type OptionType<T extends Option> = MaybeOptional<
  T["enum"] extends readonly any[]
    ? T["type"] extends "list"
      ? T["enum"][number][]
      : T["enum"][number]
    : T["type"] extends "number" | "float"
    ? number
    : T["type"] extends "boolean"
    ? boolean
    : T["type"] extends "list"
    ? string[]
    : T["positional"] extends true
    ? string[]
    : string,
  T
>;

/** Defines the final option-value type based on Option.type */
type OptionsTypes<T extends Definition<Option>> = {
  [K in keyof T]: OptionType<T[K]>;
};

/** Take into account Option.required and Option.default for defining T value */
type MaybeOptional<T, O extends Option> = O["required"] extends true
  ? T
  : O extends { default: any }
  ? T
  : T | undefined;

export type CommandOptions<T extends Omit<Command, "kind">> = T["options"] extends { [key: string]: any }
  ? Expand<OptionsTypes<T["options"]> & { _: string[]; __?: string[] }>
  : never;

type ExtractOptions<T> = {
  [K in keyof T as T[K] extends { kind: "option" } ? K : never]: T[K] extends { kind: "option" }
    ? OptionType<T[K]>
    : never;
};

type Expand<T> = T extends readonly any[]
  ? T
  : T extends object
  ? {
      [K in keyof T as T[K] extends never ? never : K]: Expand<T[K]>;
    }
  : T;

export type NamespaceOptions<
  T extends Omit<Namespace, "kind">,
  InheritedOptions extends Definition<Option> = {},
> = T["options"] extends { [key: string]: any }
  ? Expand<{
      [K in keyof T["options"]]: T["options"][K] extends { kind: "namespace" }
        ? NamespaceOptions<T["options"][K], ExtractOptions<T["options"]> & InheritedOptions>
        : T["options"][K] extends { kind: "command" }
        ? CommandOptions<T["options"][K]> & ExtractOptions<T["options"]> & InheritedOptions
        : never;
    }>
  : never;

/** Utility to define a command for extracting its options type, while still having IntelliSense
 *
 * Example:
 * ```
 * const cmd = defineCommand({ options: { somelist: { type: "list" } }});
 * type CmdOptions = CommandOptions<typeof cmd>
 * // CmdOptions: { somelist: string[] | undefined, _: string[], __?: string[] }
 * ```
 */
export const defineCommand = <T extends Omit<Command, "kind">>(c: T): T => Object.assign(c, { kind: "command" });

/** Utility to define a namespace for extracting its options type, while still having IntelliSense
 *
 * Example:
 * ```
 * const nms = defineNamespace({ options: { cmd: { options: { opt: { type: "list" } } } }});
 * type NmsOptions = NamespaceOptions<typeof nms>
 * // NmsOptions: { cmd: { opt: string | undefined, _: string[], __?: string[] } }
 * ```
 */
export const defineNamespace = <T extends Omit<Namespace, "kind">>(n: T): T => Object.assign(n, { kind: "namespace" });
