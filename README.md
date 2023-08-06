# cli-er

[![NPM version](https://img.shields.io/npm/v/cli-er.svg)](https://www.npmjs.com/package/cli-er)
[![build](https://github.com/carloscortonc/cli-er/actions/workflows/build.yml/badge.svg)](https://github.com/carloscortonc/cli-er/actions/workflows/build.yml)

Tool for building advanced CLI applications using a definition object. It implements a folder structure strategy that helps organize all the logic, also including help-generation.  
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
    options: {
      build: {
        description: "Build an image from a Dockerfile",
        options: {
          source: {
            positional: 0,
            required: true,
            description: "Path or Url to the Dockerfile"
          }
        }
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
node docker.js builder build . -- someother-external-option
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

## Installation

```sh
npm install cli-er
```

## Usage

`cli-er` default-exports a class, which takes in a [definition object](./docs/definition.md) and an optional argument [CliOptions](./docs/cli-options.md). The available methods are the following:

- [parse(args)](./docs/api.md#parseargs): parse the given arguments and return an object containing the options, errors and calculated location.
- [run(args?)](./docs/api.md#runargs): parse the given arguments and execute the corresponding script found in the calculated location. Integrates help and version generation.
- [help(location?)](./docs/api.md#helplocation): generate help based on the definition. Can be scoped to a namespace/command.
- [version()](./docs/api.md#version): generate a formatted version of the application's version.

#### Glossary
- **Namespace**: is used to group commands, but cannot be invoked. Can contain other namespaces, commands or options.
- **Command**: Is the final invocable element. Can only contain options.
- **Option**: arguments that hold values of different types, like string, boolean, list...

## Typescript cli

You can check [this example](./examples/ts-cli) on how to write a full typescript cli application.
