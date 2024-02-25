The available methods are described here:

## parse(args)

Parses the given list of arguments based on the provided definition, and returns an object containing the resulting options, and the calculated location where the script is expected to be found. If any error is generated during the process, they will be registered inside an `errors` field. The form is:

```typescript
type ParsingOutput = {
  /** Location based solely on supplied namespaces/commands */
  location: string[];
  /** Calculated options */
  options: { _: string[]; [key: string]: any };
  /** Errors originated while parsing */
  errors: string[];
}
```

If no command is found in the parsing process, an error with a suggestion (the closest to the one suplied) will be returned.

_**TIP**: You can define an option as required (`required: true`), which will verify that such option is present in the provided arguments, setting an error otherwise._

This library also interprets the delimiter `--` to stop parsing, including the remaning arguments as an array inside `ParsingOutput.options.__`


The execution of [this example](/README.md#example) would be:

```json
{
  "options": {
    "source": ".", "debug": false, "__": ["someother-external-option"]
  },
  "location": ["builder", "build"]
}
```

### option-value syntax

The library support three ways for specifying the value of an option:
- `{alias} {value}` as separate arguments (e.g `--delay 10`)
- `{alias}={value}` for long aliases (more than one letter, e.g. `--delay=10`)
- `{alias}{value}` for short aliases (a single letter, e.g. `-d10`)

Boolean options with short aliases can also be concatenated with a single leading `-`, e.g:
```bash
$ ls -la   # list also hidden files, in long format
$ ls -l -a # same as above
```

## run(args?)

Parses the given options by calling `parse(args)`, and executes the script in the computed location, forwarding the parsed options. If no arguments are provided, the args value defaults to `process.argv.slice(2)`.
With the following example (action.js):

```js
new Cli({
  cmd: {
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

This method has three main behaviours: print version, print help and execute a command:
- **print version**: if [autoincluded version](/docs/cli-options.md#versionautoinclude) is enabled and version option is provided, version will be printed.
- **print help**: if [autoincluded help](/docs/cli-options.md#helpautoinclude) is enabled and help option is provided, or a cli without `rootCommand` is invoked without location, or a namespace is invoked, help will be generated. If any errors configured in [`CliOptions.errors.onGenerateHelp`](/docs/cli-options.md#errorsongeneratehelp) are generated, they will be outputted before the help.
- **execute command**: if any errors configured in [`CliOptions.errors.onExecuteCommand`](/docs/cli-options.md#errorsonexecutecommand) are generated, they will be printed and execution will end with status `1`. Otherwise, the script location will be calculated, and the corresponding script executed.

If a cli application does not have registered a root command (logic executed without any supplied namespace/command), it should be configured with [`CliOptions.rootCommand: false`](/docs/cli-options.md#rootcommand). By doing this, when the cli application is invoked with no arguments, full help will be shown (see this [docker example](/examples/docker/docker.js#L128)).

You also use `CliOptions.rootCommand` to define a default command to execute, when no command/namespace is supplied (check this [webpack-cli example](/examples/webpack-cli)).

### Typing command's options
When defining a command handler inside a script file, in order to have typed options the following steps are needed:
- Define the command using `Cli.defineCommand`:
```typescript
const definition = Cli.defineCommand({
  // ...
  options: {
    elements: { type: "list" },
    value: { type: "float", required: true },
    files: { positional: true, required: true }
  }
})
```
- Get the type for the options by using `Cli.CommandOptions`:
```typescript
function handler(options: Cli.CommandOptions<typeof definition>){
  // options: { elements: string[] | undefined, value: number, files: string[] }
}
```


## help(location?)

Generates and outputs help message based on the provided definition. Given the following code (test.js):

```js
const definition = {
  nms: {
    description: "Description for the namespace",
    options: {
      cmd: {
        kind: "command",
        description: "Description for the command",
        options: {
          cmdOption: {
            positional: 0
          }
        }
      },
    },
  },
  gcmd: {
    kind: "command",
    description: "Description for global command",
  },
  globalOption: {
    aliases: ["g", "global"],
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

The library also checks `process.stdout.columns` to format the help and line-breaks appropriately.

_**TIP**: any `DefinitionElement` can be hidden from the generated help by using `hidden:true` on its definition._

> **Note**
> help-generation option is auto-included by default. This can be configured via [`CliOptions.help`](/docs/cli-options.md#helpautoinclude)

## version()

Prints the formatted version of the current cli application: finds the package.json for the current application, and prints its name and version.

> **Note**
> version-generation option is auto-included by default. This can be configured via [`CliOptions.version`](/docs/cli-options.md#versionautoinclude)