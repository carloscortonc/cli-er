# Intl support
To internationalize library messages, the [`CliOptions.messages`](./cli-options.md#messages) can be used to override the default messages. Check the [intl-cli example](/examples/intl-cli) for a use case.

# Routing
A "location" is calculated and returned by [`Cli.parse`](./api.md#parseargs). This is the route to the final invocable command.
With this location, the [`Cli.run`](./api.md#runargs) method generates a list of candidate files to execute and provide the parsed options. For each element of the location list (`[...rest, element]`):
1. `{...rest}/{element}/index` file.
2. `{...rest}/{element}` file.
3. The name of the entrypoint file

For all of these candidates, only two from from the last element are imported with default import, the rest with named import (the name of the last element).  
For single commands, the location is prefixed with [`CliOptions.rootCommand`](./cli-options.md#rootcommand), if declared as string.

### Example
If the location is `["nms", "cmd"]` for an entryfile `cli.js`, the list of candidates (in order) will be:
1. `/nms/cmd/index.js` - default import
2. `/nms/cmd.js` - default import
3. `/nms/index.js` - named import  (`cmd`)
4. `/nms.js` - named import  (`cmd`)
5. `/index.js` - named import  (`cmd`)
6. `/cli.js` - named import  (`cmd`)

# Debug mode
When active, the library will generate debug logs warning about problems, deprecations or suggestions.
If any is generated, the `exitCode` will be set to `1`, so a simple validation-workflow can be built with this.
To see how to enable it check [`CliOptions.debug`](./cli-options.md#debug).

# Typescript support
You can check [this example](./examples/ts-cli) on how to write a full typescript cli application.