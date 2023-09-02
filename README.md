<h1 align="center">cli-er</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/cli-er" target="_blank">
    <img src="https://img.shields.io/npm/v/cli-er.svg" alt="NPM version">
  </a>
  <a href="https://github.com/carloscortonc/cli-er/actions/workflows/build.yml" target="_blank">
    <img src="https://github.com/carloscortonc/cli-er/actions/workflows/build.yml/badge.svg" alt="build">
  </a>
</p>

<p align="center">
  Tool for building advanced CLI applications using a definition object.</br>
  Implements a folder structure strategy that helps organize all the logic, also including help-generation.  
</p>

<h4 align="center">
  <a href="#features">Features</a>
  <span>&nbsp;·&nbsp;</span>
  <a href="#installation">Installation</a>
  <span>&nbsp;·&nbsp;</span>
  <a href="#usage">Usage</a>
  <span>&nbsp;·&nbsp;</span>
  <a href="./docs/definition.md">Definition</a>
  <span>&nbsp;·&nbsp;</span>
  <a href="./docs/cli-options.md">Options</a>
</h4>

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
    description: "Manage builds",
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
    aliases: ["D", "debug"],
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


## Features
- [**Intl support**](./docs/features.md#intl-support): support for internationalized messages.
- [**Routing**](./docs/features.md#routing): routes are generated where command handlers are expected to be found.
- [**Debug mode**](./docs/features.md#debug-mode): validate the definition and options, especially when upgrading to a new version.
- [**Typescript support**](./docs/features.md#typescript-support): build the cli with typescript.


## Installation

```sh
npm install cli-er
```

## Usage

`cli-er` default-exports a class, which takes in a [definition object](./docs/definition.md) and an optional argument [CliOptions](./docs/cli-options.md). The available methods are the following:

- [**parse(args)**](./docs/api.md#parseargs): parse the given arguments and return an object containing the options, errors and calculated location.
- [**run(args?)**](./docs/api.md#runargs): parse the given arguments and execute the corresponding script found in the calculated location. Integrates help and version generation.
- [**help(location?)**](./docs/api.md#helplocation): generate help based on the definition. Can be scoped to a namespace/command.
- [**version()**](./docs/api.md#version): generate a formatted version of the application's version.

#### Glossary
- **Namespace**: is used to group commands, but cannot be invoked. Can contain other namespaces, commands or options.
- **Command**: Is the final invocable element. Can only contain options.
- **Option**: arguments that hold values of different types, like string, boolean, list...
