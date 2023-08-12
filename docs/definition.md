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
- **description**: description of the element, to be used when generating help.
- **hidden**: hide an element when generating help.

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
  options?: Definition<Option>;
  action?: (out: ParsingOutput) => void;
}
```
- **action**: method that will be called when the command is matched, receiving the output of the parsing process.

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
  parser?: (input: ValueParserInput) => ValueParserOutput
}
```
- **aliases**: alternative names for the options, e.g. `["h", "help"]`. They should be specified without dashes, and final alias value will be calculated depending on the provided alias length: `-` for single letters, and `--` in other cases. When not specified, the name of the option will be used.
- **positional**: enables [positional options](#positional-options).
- **negatable**: whether to include [negated aliases](#negated-aliases) in boolean options.
- **default**: default value for the option.
- **required**: specifies an option as required, generating an error if a value is not provided.
- **type**: type of option, to load the correct parser.
- **parser**: allows defining [custom parser](#custom-parser) for an option, instead of using the supported types.

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
For options with `type:boolean`, negated aliases are included by default. These negated aliases are generated from original aliases, prefixing `no` and `no-`.
To turn this feature off, specify `negatable:false`

```js
new Cli({ debug: { type: "boolean"}}, { cliName: "cli" })
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
  /** Method for formatting errors */
  format: typeof CliError.format;
}

type ValueParserOutput = {
  /** Final value for the parsed option */
  value?: any;
  /** Number of additional arguments that the parser consumed. For example, a boolean option
   * might not consume any additional arguments ("--show-config", next=0) while a string option
   * would ("--path path-value", next=1). The main case of `next=0` is when incoming value
   * is `undefined` */
  next?: number;
  /** Error generated during parsing */
  error?: string;
}
```

**Example**: [custom-option-parser](/examples/custom-option-parser)