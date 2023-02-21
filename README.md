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

Given the following definition (entrypoint.js):

```js
const definition = {
  nms: {
    kind: "namespace",
    options: {
      cmd: {
        kind: "command",
        type: "string",
      },
    },
  },
};
```

it will allow us to structure the code as follows:

```sh
.
├─ entrypoint.js
└─ nms
   └── cmd.js
```

so we can then execute:

```
node entrypoint.js nms cmd commandvalue
```

which will try to invoke `/nms/cmd.js` and `/nms/cmd/index.js` with the parsed options.
This allows us to organize and structure the logic nicely.

You can check the [docker-based example](./examples/docker) for a more in-depth demo.

## Usage

`cli-er` default-exports a class, which takes in the definition object and an optional argument CliOptions. The available methods are the following:

### parse(args)

Parses the given list of arguments based on the provided definition, and returns an object containing the resulting options, and the calculated location where the script is expected to be found. If an error is generated during the process, it will be registered inside an `error` field.
An option value may be modified after the parsing process is completed: this can be achieved by defining `Option.value` with the following signature:

```typescript
type value = (v: OptionValue, o: ParsingOutput.options) => OptionValue;
```

This allows to create custom parsers for any type of input (check the [custom-option-parser example](./examples/custom-option-parser) for a hint).

The execution of the above [example](#example) would be:

```json
{ "options": { "cmd": "commandValue" }, "location": ["nms", "cmd"] }
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

If no command is found in the parsing process, an error and suggestion (the closest to the one suplied) will be shown. This can be configured via `CliOptions.onFail.suggestion`.

If an unknown option if found, the default behaviour is to print the error and exit. This can be configured via `CliOptions.onFail.stopOnUnknownOption`.

If a cli application does not have registered a root command (logic executed without any supplied namespace/command), it should be configured with `CliOptions.rootCommand: false`. By doing this, when the cli application is invoked with no arguments, full help will be shown (see this [docker example](./examples/docker/docker.js#L121)).

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
> help-generation option is auto-included by default. This can be configured via `CliOptions.help`

### version()

Prints the formatted version of the current cli application: finds the package.json for the current application, and
prints its name and version.

> **Note**
> version-generation option is auto-included by default. This can be configured via `CliOptions.version`

## Custom logger

You may change the default logger via `CliOptions.logger`. It contains two methods, `log` and `error`, that can be used to add a prefix to the log (e.g. "error ") or change the output color, as demonstrated in this [docker example](./examples/docker/docker.js#L123).

## Typescript cli

You can check [this example](./examples/ts-cli) on how to write a full typescript cli application.
