The definition object describing the Cli.

The general form is:

```typescript
type Definition<T = Namespace | Command | Option> = {
  [key: string]: T
}
```


All three types have some properties in common:
```typescript
type BaseElement = {
  kind?: "namespace" | "command" | "option";
  description?: string;
  hidden?: boolean;
}
```
- **kind**: describes the type of element.
- **description**: description of the element, to be used when generating help. The library will search first in `CliOptions.messages` with an id generated from element's location and name, followed by `.description`. So for example, for a nested option `opt` inside a command `cmd`, the id will be `cmd.opt.description`.
- **hidden**: hide an element when generating help. Default: `false`

## Namespace
An element with `kind: "namespace"`, or since 0.11.0, when its kind is inferred to this one.
```typescript
type Namespace = BaseElement & {
  kind: "namespace",
  options: Definition<Namespace | Command | Option>
}
```

## Command
An element with `kind: "command"`, or since 0.11.0, when its kind is inferred to this one.
```typescript
type Command = BaseElement & {
  kind: "command";
  aliases?: string[];
  options?: Definition<Option>;
  action?: (out: ParsingOutput) => void;
  usage?: string;
}
```
- **aliases**: alternative names for the command. If specified, the will added on top of command key. Default: `[key]`.
- **action**: method that will be called when the command is matched, receiving the output of the parsing process.
- **usage**: override default `Usage` content for this command.

## Option
An element with `kind: "option"`, or since 0.11.0, when its kind is inferred to this one.
```typescript
type Option = BaseElement & {
  kind: "option";
  aliases?: string[];
  positional?: boolean | number;
  negatable?: boolean;
  default?: any;
  required?: boolean;
  type?: "string" | "boolean" | "list" | "number" | "float";
  enum?: (string | number)[];
  parser?: (input: ValueParserInput) => ValueParserOutput;
  requires?: string[] | ((v: OptionValue) => string[]);
}
```
- **aliases**: alternative names for the options, e.g. `["h", "help"]`. They should be specified without dashes, and final alias value will be calculated depending on the provided alias length: prefixed with `-` for single letters, and `--` in other cases. When not specified, the name of the option will be used. Default: `[key]`
- **positional**: enables [positional options](#positional-options). Default: `false`
- **negatable**: whether to include [negated aliases](#negated-aliases) in boolean options. Default: `false`
- **default**: default value for the option.
- **required**: specifies an option as required, generating an error if a value is not provided. Default: `false`
- **type**: type of option, to load the appropriate parser. Default: `string`
- **enum**: restrict the possible option-values based on the given list. Available for option-types `string`, `list`, `number` and `float`.
- **parser**: allows defining [custom parser](#custom-parser) for an option, instead of using the supported types.
- **requires**: specifies a list of options that need to be set if this option is also set. A function may be provided, receiving the current option value.

### Positional options
Positional options allow asigning an option to a determinate position in the arguments.
- If a number is used, the argument provided in that position will be assigned to the option with that number (as long as the argument does not match with any existing alias).
- If `true` is provided, all isolated arguments will be assigned to this option, in the form of a list.

```js
new Cli({ projectName: { positional: 0} }, { cliName: "create-project" });
// $ create-project newproject
// => { options: { projectName: "newproject" }}

new Cli({ files: { positional: true} }, { cliName: "format" });
// $ format file1 file2 file3
// => { options: { files: ["file1", "file2", "file3"] }}
```

**Example**: [jest-cli](/examples/jest-cli/)

### Negated aliases
For options with `type:boolean`, negated aliases can be included specifying `negatable:true`. These negated aliases are generated from original aliases, prefixing `no` and `no-`.

```js
new Cli({ debug: { type: "boolean", negatable: true }}, { cliName: "cli" })
// $ cli --debug
// => { options: { debug : true }}

// $ cli --no-debug
// => { options: { debug : false }}

// $ cli --nodebug
// => { options: { debug : false }}
```

**Example**: [secondary-cli](/examples/options-only/secondary-cli.js)

### Custom parser
```typescript
type ValueParserInput = {
  /** Value to process */
  value: string | undefined;
  /** Current value of the option */
  current: OptionValue;
  /** Option definition */
  option: Option & { key: string };
}

type ValueParserOutput = {
  /** Final value for the parsed option */
  value?: any;
  /** Number of additional arguments that the parser consumed. For example, a boolean option
   * might not consume any additional arguments ("--show-config", next=0) while a string option
   * would ("--path path-value", next=1). The main use-case of `next=0` is when incoming value
   * is `undefined` */
  next?: number;
  /** Error generated during parsing */
  error?: string;
}
```

**Example**: [custom-option-parser](/examples/custom-option-parser)