# Getting Started

## Overview

`cli-er` is a Node.js library for building **modular, type-safe CLI applications** from a plain definition object. It handles argument parsing, help generation, routing to command handlers, lifecycle hooks, and more — with zero configuration needed for basic usage.

## Installation

```sh
npm install cli-er
```

Node.js ≥ 12 is required.

## Basic usage

Create an entry file (e.g. `cli.js`) and instantiate `Cli` with a [definition object](/guide/definition):

```js
import Cli from "cli-er";

const definition = {
  greet: {
    description: "Print a greeting",
    options: {
      name: {
        type: "string",
        aliases: ["n", "name"],
        description: "Name to greet",
        default: "stranger",
      },
    },
    action({ options }) {
      console.log(`Hello ${options.name}!`);
    },
  },
};

new Cli(definition).run();
```

Invoke it:

```sh
node cli.js greet --name World
```

`cli-er` will resolve the `greet` command, forward `{ options: { name: "World" }, ...}` to the corresponding handler (in this example, an inline action function), and run it.

## Glossary

| Term | Meaning |
|---|---|
| **Namespace** | Groups commands. Cannot be directly invoked. May contain other namespaces, commands, and options. |
| **Command** | The final invocable element. Can contain options and an `action` function. |
| **Option** | A typed argument (`string`, `boolean`, `list`, `number`, `float`). Supports aliases, defaults, positional, required, stdin, and more. |

## Folder structure strategy

`cli-er` encourages splitting command handlers into separate files, using the command location as the path:

```sh
.
├── cli.js          # entry point
└── greet.js        # handler for the "greet" command
```

For larger CLIs with namespaces, the structure mirrors the command tree:

```sh
.
├── cli.js
└── builder/
    └── build.js    # handler for "builder build"
```

See [Features → Routing](/guide/features#routing) for the full resolution algorithm.

## Example: docker-like CLI

```js
const definition = {
  builder: {
    description: "Manage builds",
    options: {
      build: {
        description: "Build an image from a Dockerfile",
        options: {
          source: { positional: 0, required: true, description: "Path or URL to Dockerfile" },
        },
      },
    },
  },
  debug: { type: "boolean", aliases: ["D", "debug"], default: false },
};

new Cli(definition).run();
```

```sh
node cli.js builder build ./path -- extra-arg
```

Check the full [docker example](/examples/docker) and the interactive [Playground](https://carloscortonc.github.io/cli-er/?cmd=docker).

## Next steps

- [**Definition**](/guide/definition) — learn every field of the definition object.
- [**Features**](/guide/features) — routing, hooks, plugins, config files, bash completion, and more.
- [**API reference**](/reference/api) — all public methods on the `Cli` class.
- [**CLI Options**](/reference/cli-options) — full `CliOptions` reference.
