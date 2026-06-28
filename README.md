<h1 align="center">cli-er</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/cli-er" target="_blank">
    <img src="https://badgen.net/npm/v/cli-er" alt="NPM version">
  </a>
  <a href="https://github.com/carloscortonc/cli-er/actions/workflows/build.yml" target="_blank">
    <img src="https://github.com/carloscortonc/cli-er/actions/workflows/build.yml/badge.svg" alt="build">
  </a>
</p>

<p align="center">
  Tool for building advanced type-safe CLI applications using a definition object.</br>
  Implements a folder structure strategy that helps organize all the logic, also including help-generation.  
</p>

<h4 align="center">
  <a href="https://carloscortonc.github.io/cli-er/docs/guide/getting-started">Features</a>
  <span>&nbsp;·&nbsp;</span>
  <a href="https://carloscortonc.github.io/cli-er/docs/guide/getting-started#installation">Installation</a>
  <span>&nbsp;·&nbsp;</span>
  <a href="https://carloscortonc.github.io/cli-er/docs/guide/getting-started#basic-usage">Usage</a>
  <span>&nbsp;·&nbsp;</span>
  <a href="https://carloscortonc.github.io/cli-er/docs/guide/definition">Definition</a>
  <span>&nbsp;·&nbsp;</span>
  <a href="https://carloscortonc.github.io/cli-er/docs/reference/cli-options">Options</a>
  <span>&nbsp;·&nbsp;</span>
  <a href="https://carloscortonc.github.io/cli-er/docs/">Docs</a>
  <span>&nbsp;·&nbsp;</span>
  <a href="https://carloscortonc.github.io/cli-er/">Live demo</a>
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


## Features
- [**Help generation**](https://carloscortonc.github.io/cli-er/docs/guide/features#help-generation): help is generated for all commands and options.
- [**Routing**](https://carloscortonc.github.io/cli-er/docs/guide/features#routing): routes are generated where command handlers are expected to be found.
- [**Configuration file support**](https://carloscortonc.github.io/cli-er/docs/guide/features#configuration-file-support): define the list of configuration file-names for your cli, and `cli-er` will try to find (from `process.cwd()` up), read its contents, and use it inside [`Cli.run`](https://carloscortonc.github.io/cli-er/docs/reference/api#runargs).
- [**Lifecycle hooks**](https://carloscortonc.github.io/cli-er/docs/guide/features#lifecycle-hooks): execute code on lifecycle events when using `Cli.run()` (beforeParse, afterParse, beforeExecute, afterExecute).
- [**Plugins**](https://carloscortonc.github.io/cli-er/docs/guide/features#plugins): define reusable logic with a set of hooks.
- [**Environment-variable prefix support**](https://carloscortonc.github.io/cli-er/docs/guide/features#environment-variable-prefix-support): define a prefix so all environment variables matching that will be passed into [`Cli.run`](https://carloscortonc.github.io/cli-er/docs/reference/api#runargs).
- [**Reading from stdin**](https://carloscortonc.github.io/cli-er/docs/guide/definition#reading-from-stdin): configure options whose value can be provided from stdin.
- [**Intl support**](https://carloscortonc.github.io/cli-er/docs/guide/features#intl-support): support for internationalized messages.
- [**Bash completion**](https://carloscortonc.github.io/cli-er/docs/guide/features#bash-completion): a command is created to generate the `bash-completions` script for the cli.
- [**Debug logger**](https://carloscortonc.github.io/cli-er/docs/guide/features#debug-logger): static debug-logging utility.
- [**Debug mode**](https://carloscortonc.github.io/cli-er/docs/guide/features#debug-mode): validate the definition and options, especially when upgrading to a new version.
- [**Typescript support**](https://carloscortonc.github.io/cli-er/docs/guide/features#typescript-support): build the cli with typescript.


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


## Installation

```sh
npm install cli-er
```

## Usage

`cli-er` default-exports a class, which takes in a [definition object](https://carloscortonc.github.io/cli-er/docs/guide/definition) and an optional argument [CliOptions](https://carloscortonc.github.io/cli-er/docs/reference/cli-options). The available methods are the following:

- [**parse(args)**](https://carloscortonc.github.io/cli-er/docs/reference/api#parseargs): parse the given arguments and return an object containing the options, errors and calculated location.
- [**run(args?)**](https://carloscortonc.github.io/cli-er/docs/reference/api#runargs): parse the given arguments and execute the corresponding script found in the calculated location. Integrates help and version generation.
- [**help(location?)**](https://carloscortonc.github.io/cli-er/docs/reference/api#helplocation): generate help based on the definition. Can be scoped to a namespace/command.
- [**version()**](https://carloscortonc.github.io/cli-er/docs/reference/api#version): generate a formatted version of the application's version.
- [**completions()**](https://carloscortonc.github.io/cli-er/docs/reference/api#completions): output bash-completion script contents.
- [**configContent()**](https://carloscortonc.github.io/cli-er/docs/reference/api#configcontent): find the contents of configuration files (e.g. `.prettierrc.json`).
- [**envContent()**](https://carloscortonc.github.io/cli-er/docs/reference/api#envcontent): find the contents of configuration files (e.g. `.prettierrc.json`).

#### Glossary
- **Namespace**: is used to group commands, but cannot be invoked. Can contain other namespaces, commands or options.
- **Command**: Is the final invocable element. Can only contain options.
- **Option**: arguments that hold values of different types, like string, boolean, list...
