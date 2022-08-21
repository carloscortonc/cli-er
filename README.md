# cli-er
[![NPM version](https://img.shields.io/npm/v/cli-er.svg)](https://www.npmjs.com/package/cli-er)
[![build](https://github.com/carloscortonc/cli-er/actions/workflows/build.yml/badge.svg)](https://github.com/carloscortonc/cli-er/actions/workflows/build.yml)

Tool for building advance CLI applications using a definition object. It implements a folder structure strategy that helps organize all the logic, also including help-generation  
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

## Usage

`cli-er` default-exports a class, which takes in the definition object and an optional argument CliOptions. The available methods are the following:

### parse(args)

Parses the given list of arguments based on the provided definition, and returns an object containing the resulting options. The execution of the above [example](#example) would be:

```
{ options: { cmd: "commandValue" }, location: ["nms", "cmd"] }
```

### run(args?)

Parses the given options by calling `parse(args)`, and executes the script in the computed location, forwarding the parsed options. If no arguments are provided, the value defaults to `process.argv.slice(2)`.

### help(location?)

Generates and outputs help message based on the provided definition. Given the following code:

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
    type: "string",
    aliases: ["-g", "--global"],
    default: "globalvalue",
    description: "Option shared between all commands",
  },
};

new Cli(definition).help();
```

will output:

```
Namespaces:
  nms           Description for the namespace

Commands:
  gcmd          Description for global command

Global options:
  -g, --global  Option shared between all commands (default: globalvalue)
```

The optional argument _location_ enables the generation of scoped help. For the above definition, the following code:

```js
new Cli(definition).help(["nms"]);
```

will output:

```
Description for the namespace

Commands:
  cmd  Description for the command
```
