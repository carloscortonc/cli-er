# cli-er

[![NPM version](https://img.shields.io/npm/v/cli-er.svg)](https://www.npmjs.com/package/cli-er)
[![build](https://github.com/carloscortonc/cli-er/actions/workflows/build.yml/badge.svg)](https://github.com/carloscortonc/cli-er/actions/workflows/build.yml)

Tool for building advanced CLI applications using a definition object. It implements a folder structure strategy that helps organize all the logic, also including help-generation  
</br>

_cli.js_:

```js
import Cli from "cli-er";

const definition = {...}

new Cli(definition).run();
```

Invocation:

```
node cli.js [namespace(s)|command] [OPTIONS]
```

#### Example

Given the following definition (docker.js):

```js
const definition = {
  builder: {
    kind: "namespace",
    options: {
      build: {
        kind: "command",
        type: "string",
        description: "Build an image from a Dockerfile",
      },
    },
  },
  debug: {
    type: "boolean",
    aliases: ["-D", "--debug"],
    default: false,
  },
};
```

it will allow us to structure the code as follows:

```sh
.
├─ docker.js
└─ builder
   └── build.js
```

so we can then execute:

```
node docker.js builder build .
```

which will try to invoke, in order:
1. `/builder/build/index.js`
2. `/builder/build.js`
3. `/builder/index.js`
4. `/builder.js`
5. `/index.js`
6. `/docker.js`

with the parsed options (only the first two are default imports, the rest are named imports using the command name, in this case `build`).
This allows us to organize and structure the logic nicely.

You can check the full [docker-based example](./examples/docker) for a more in-depth demo.

## Usage

`cli-er` default-exports a class, which takes in the definition object and an optional argument [CliOptions](#clioptions). The available methods are the following:

### parse(args)

Parses the given list of arguments based on the provided definition, and returns an object containing the resulting options, and the calculated location where the script is expected to be found. If any error is generated during the process, they will be registered inside an `errors` field.
A custom parser for an Option may be used, with the following signature:

```typescript
type parser = (input: ValueParserInput) => ValueParserOutput;

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

This allows to create custom parsers for any type of input (check the [custom-option-parser example](./examples/custom-option-parser) for a hint), or to override the existing parsers logic.

The execution of the above [example](#example) would be:

```json
{ "options": { "build": ".", "debug": false }, "location": ["builder", "build"] }
```

### run(args?)

Parses the given options by calling `parse(args)`, and executes the script in the computed location, forwarding the parsed options. Alternatively, a command can be defined with an `action` function that will be called when the command is matched. If no arguments are provided, the args value defaults to `process.argv.slice(2)`.
With the following example (action.js):

```js
new Cli({
  cmd: {
    kind: "command",
    options: {
      log: { type: "boolean" },
    },
    action: ({ options }) => {
      if (options.log) {
        console.log("Log from cmd");
      }
    },
  },
}).run();
```

invoking with `node action.js cmd --log` will print _"Log from cmd"_ into the console.

If no command is found in the parsing process, an error and suggestion (the closest to the one suplied) will be shown.

You can define an option as required (`required: true`), which will verify that such option is present in the provided arguments, setting an error otherwise.

This method has three main behaviours: print version, print help and execute a command:
- **print version**: if [autoincluded version](#versionautoinclude) is enabled and version option is provided, version will be printed.
- **print help**: if [autoincluded help](#helpautoinclude) is enabled and help option is provided, or a cli without `rootCommand` is invoked without location, or a namespace is invoked, help will be generated. If any errors configured in [`CliOptions.errors.onGenerateHelp`](#errorsongeneratehelp) are generated, they will be outputted before the help.
- **execute command**: if any errors configured in [`CliOptions.errors.onExecuteCommand`](#errorsonexecutecommand) are generated, they will be printed and execution will end with status `1`. Otherwise, the script location will be calculated, and the corresponding script executed.

If a cli application does not have registered a root command (logic executed without any supplied namespace/command), it should be configured with [`CliOptions.rootCommand: false`](#rootcommand). By doing this, when the cli application is invoked with no arguments, full help will be shown (see this [docker example](./examples/docker/docker.js#L128)).

### help(location?)

Generates and outputs help message based on the provided definition. Given the following code (test.js):

```js
const definition = {
  nms: {
    kind: "namespace",
    description: "Description for the namespace",
    options: {
      cmd: {
        kind: "command",
        type: "string",
        description: "Description for the command",
      },
    },
  },
  gcmd: {
    kind: "command",
    description: "Description for global command",
  },
  globalOption: {
    aliases: ["-g", "--global"],
    default: "globalvalue",
    description: "Option shared between all commands",
  },
};

new Cli(definition, { cliDescription: "Cli for testing purposes" }).help();
```

will output:

```
Usage:  test NAMESPACE|COMMAND [OPTIONS]

Cli for testing purposes

Namespaces:
  nms           Description for the namespace

Commands:
  gcmd          Description for global command

Options:
  -g, --global  Option shared between all commands (default: globalvalue)
  -h, --help    Display global help, or scoped to a namespace/command
```

The optional argument _location_ enables the generation of scoped help. For the above definition, the following code:

```js
new Cli(definition).help(["nms"]);
```

will output:

```
Usage:  test nms COMMAND [OPTIONS]

Description for the namespace

Commands:
  cmd  Description for the command

Options:
  -g, --global  Option shared between all commands (default: globalvalue)
  -h, --help    Display global help, or scoped to a namespace/command
```

Any `DefinitionElement` can be hidden from the generated help by using `hidden:true` on its definition.

> **Note**
> help-generation option is auto-included by default. This can be configured via [`CliOptions.help`](#helpautoinclude)

### version()

Prints the formatted version of the current cli application: finds the package.json for the current application, and prints its name and version.

> **Note**
> version-generation option is auto-included by default. This can be configured via [`CliOptions.version`](#versionautoinclude)

</br>

### CliOptions

A configuration object may be provided in the class constructor. The available options are:

#### `baseLocation`
Location of the main cli application.</br>
**Default**: `path.dirname(entryFile)`

#### `baseScriptLocation`
Base path where the `ProcessingOutput.location` will start from</br>
**Default**: `path.dirname(entryFile)`

#### `commandsPath`
Path where the single-command scripts (not contained in any namespace) are stored, starting from `CliOptions.baseScriptLocation`</br>
**Default**: `"commands"`

#### ~~`onFail.help`~~
Whether to print scoped-help when no valid script path is found</br>
**Default**: `true`
> **Warning**
> **Deprecated since 0.10.0. Will be removed in 0.11.0**

#### `errors`
Configuration related to when errors should be displayed. The order of the lists containing the error-types matters, as it changes which error-messages are shown first (elements appearing first have a higher order of precedence).
The available error-types are:
- `command_not_found`: an unknown argument is encountered when a command was expected
- `option_wrong_value`: the option parser considers the given value as incorrect (e.g. `type:number` when given `"a123"`)
- `option_required`: an option is marked as required but is not provided
- `option_missing_value`: an option is provided without its corresponding value
- `option_not_found`: an unknown argument is encountered when an option was expected

##### `errors.onGenerateHelp`
List of error-types that will get displayed before help</br>
**Default**: `["command_not_found"]`
##### `errors.onExecuteCommand`
List of error-types that will cause to end execution with `exit(1)` </br>
**Default**: `["command_not_found", "option_wrong_value", "option_required", "option_missing_value", "option_not_found"]`

#### `help`
Help-related configuration
##### `help.autoInclude`
Whether to generate help option</br>
**Default**: `true`
##### `help.aliases`
Aliases to be used for help option</br>
**Default**: `["-h", "--help"]`
##### `help.description`
Description for the option
##### `help.template`
Template to be used when generating help. There are five distinct sections: **usage**, **description**, **namespaces**, **commands** and **options**. This can be used to include a header/footer, change the order of the sections, or remove a section altogether. If a section has no content, it will be removed along with any line-breaks that follow. You can see a use-case for this in the [docker example](./examples/docker/docker.js#L130)</br>
**Default**: `\n{usage}\n{description}\n{namespaces}\n{commands}\n{options}\n`

#### `version`
Version-related configuration
##### `version.autoInclude`
Whether to generate version option</br>
**Default**: `true`
##### `version.aliases`
Aliases to be used for version option</br>
**Default**: `["-v", "--version"]`
##### `version.description`
Description for the option

#### `rootCommand`
Whether the cli implements a root command (invocation with no additional namespaces/commands)</br>
**Default**: `true`

#### `logger`
Logger to be used by the cli. It contains two methods, `log` and `error`, that can be used to add a prefix to the log (e.g. "error ") or change the output color, as demonstrated in this [docker example](./examples/docker/docker.js#L133).</br>
**Default**: [./src/cli-logger.ts](./src/cli-logger.ts)

#### `cliName`
Cli name to be used instead of the one defined in package.json</br>
**Default**: `packageJson.name`

#### `cliVersion`
Cli version to be used instead of the one defined in package.json</br>
**Default**: `packageJson.version`

#### `cliDescription`
Cli description to be used instead of the one defined in package.json</br>
**Default**: `packageJson.description`

### `debug`
Enable debug mode. This is intended for the development phase of the cli. It will:
- Print verbose errors when a script in not found in the expected path during [`Cli.run`](#runargs).
- **Print warnings for deprecated properties/methods**, useful for detecting and applying these changes before updating to the next version.

Its value can also be configured using an enviroment variable:
```shell
$ CLIER_DEBUG=1 node cli.js
```

**Default**: `process.env.CLIER_DEBUG`

## Typescript cli

You can check [this example](./examples/ts-cli) on how to write a full typescript cli application.
