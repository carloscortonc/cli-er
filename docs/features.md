## Help generation
`cli-er` will include by default a help option (`-h`/`--help`), which will generate help on the current location (scoped). Some features include:
- Document negated option aliases.
- Options from parent scopes will also be documented, in the same way it is implemented when parsing arguments.
- Enable override of `Usage` section for commands.
- Use of `process.stdout.columns` to format the help and line-breaks appropriately.

## Routing
A "location" is calculated and returned by [`Cli.parse`](/docs/api.md#parseargs): this is the route to the final invocable command.
With this location, the [`Cli.run`](/docs/api.md#runargs) method generates a list of candidate files to execute and forward the parsed options. For each element of the location list (`[...rest, element]`):
1. `{...rest}/{element}/index` file.
2. `{...rest}/{element}` file.
3. The name of the entrypoint file

For all of these candidates, only the two from the last element are imported with default import, the rest with named import (the name of the last element).  
For single commands, the location is prefixed with [`CliOptions.rootCommand`](/docs/cli-options.md#rootcommand), if declared as string.

### Example
If the location is `["nms", "cmd"]` for an entryfile `cli.js`, the list of candidates (in order) will be:
1. `/nms/cmd/index.js` - default import
2. `/nms/cmd.js` - default import
3. `/nms/index.js` - named import  (`cmd`)
4. `/nms.js` - named import  (`cmd`)
5. `/index.js` - named import  (`cmd`)
6. `/cli.js` - named import  (`cmd`)

## Configuration file support
A list of configuration file names can be used, so its contents will be processed when using [`Cli.run`](/docs/api.md#runargs).  
Starting from the current directory where the cli is invoked (`process.cwd()`), the program will search up a file matching the provided list.
The default format support is `JSON`, but a parser may be provided to manage other formats:

```typescript
import { parse } from 'ini'; // https://github.com/npm/ini

new Cli(definition, {
  configFile: {
    names: [".npmrc", "npmrc"],
    parse: (content) => parse(content),
  },
}).run();
```

## Environment-variable prefix support
A [prefix](/docs/cli-options.md#envprefix) for environment variables can be provided, so those with such prefix will extracted into options and used inside [`Cli.run`](/docs/api.md#runargs).  
The final option key is the result of stripping the prefix and transforming to lowercase.

> `envPrefix` extracted options have **HIGHER** precedence over `configFile` parsed options

```typescript
// process.env: { RPI_USER: "uservalue", RPI_IP: "ipvalue" }

const c = new Cli(definition, { envPrefix: "RPI_"} ).run();

// Final options will include:
// { user: "uservalue", ip: "ipvalue"}
```


## Intl support
To internationalize library messages, the [`CliOptions.messages`](/docs/cli-options.md#messages) can be used to override the default messages. Check the [intl-cli example](/examples/intl-cli) for a use case.  
`CliOptions.messages` can be also be used to specify descriptions for element's definition. For this, the key must be the full route to such element, followed by `".description"`, e.g:
```javascript
new Cli({
  nms: {
    options: {
      cmd: {
        debug: { type: "boolean"}
      }
    }
  }
}, {
  messages: {
    "nms.description": "Namespace",
    "nms.cmd.description": "Command",
    "nms.cmd.debug.description": "Option",
  }
})
```

## Bash completion
`cli-er` includes a command to generate bash-completions for the cli. This can be configured through [`CliOptions.completion`](/docs/cli-options.md#completion), to change the name of such command, or to disable this behaviour.  
You can check [here](/examples/docker/completions.sh) the generated script for docker example.
> The script was tested with `bash` version 3.2.57 and `zsh` version 5.9.

## Debug mode
When active, the library will generate debug logs warning about problems, deprecations or suggestions. Two types exist:
- `WARN`: to indicated misused or deprecated options.
- `TRACE`: information related to the execution (like the list of considered files to invoke).

If any `WARN` log is generated, the `exitCode` will be set to `1`, so a simple validation-workflow can be built with this.
To see how to enable it check [`CliOptions.debug`](/docs/cli-options.md#debug).

## Typescript support
You can check [this example](/examples/ts-cli) on how to write a full typescript cli application. Some features are:
- [Typed command options](/docs/api.md#typescript-typing-commands-options): utility to infer the type of the final options for a command.
- [Typed namespace options](/docs/api.md#typescript-typing-namespaces-options): utility to infer the type of the final options for a namespace.