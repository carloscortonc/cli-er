### CliOptions

A configuration object may be provided in the class constructor. The available options are:

#### `baseLocation`
Base path where the `ProcessingOutput.location` will start from.</br>
**Default**: `path.dirname(entryFile)`

#### ~~`baseScriptLocation`~~
Base path where the `ProcessingOutput.location` will start from.</br>
**Default**: `path.dirname(entryFile)`
> **Warning**
> **Deprecated since 0.13.0 in favor of `CliOptions.baseLocation`**

#### `commandsPath`
Path where the single-command scripts (not contained in any namespace) are stored. A relative value can be provided, using `CliOptions.baseScriptLocation` as base path.</br>
**Default**: `"commands"`

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
**Default**: `["h", "help"]`
##### `help.description`
Description for the option
##### `help.template`
Template to be used when generating help. There are five distinct sections: **usage**, **description**, **namespaces**, **commands** and **options**. This can be used to include a header/footer, change the order of the sections, or remove a section altogether. If a section has no content, it will be removed along with any line-breaks that follow. You can see a use-case for this in the [docker example](/examples/docker/docker.js#L130)</br>
**Default**: `\n{usage}\n{description}\n{namespaces}\n{commands}\n{options}\n`

#### `version`
Version-related configuration
##### `version.autoInclude`
Whether to generate version option</br>
**Default**: `true`
##### `version.aliases`
Aliases to be used for version option</br>
**Default**: `["v", "version"]`
##### `version.description`
Description for the option

#### `rootCommand`
Whether the cli implements a root command (invocation with no additional namespaces/commands).
If a string is provided, it will be used as the default command to execute </br>
**Default**: `true`

#### `logger`
Logger to be used by the cli. It contains two methods, `log` and `error`, that can be used to add a prefix to the log (e.g. "error ") or change the output color, as demonstrated in this [docker example](/examples/docker/docker.js#L133).</br>
**Default**: [/src/cli-logger.ts](/src/cli-logger.ts)

#### `cliName`
Cli name to be used instead of the one defined in package.json</br>
**Default**: `packageJson.name`

#### `cliVersion`
Cli version to be used instead of the one defined in package.json</br>
**Default**: `packageJson.version`

#### `cliDescription`
Cli description to be used instead of the one defined in package.json</br>
**Default**: `packageJson.description`

#### `debug`
Enable debug mode. This is intended for the development phase of the cli. It will:
- Print verbose errors when a script in not found in the expected path during [`Cli.run`](/docs/api.md#runargs).
- **Print warnings for deprecated properties/methods**, useful for detecting and applying these changes before updating to the next version.

Its value can also be configured using an enviroment variable:
```shell
$ CLIER_DEBUG=1 node cli.js
```

**Default**: `process.env.CLIER_DEBUG`

#### `completion`
Configure bash-completion functionality
##### `completion.enabled`
Whether to create bash-completion command</br>
**Default**: `true`
##### `completion.command`
Name of the completion command
**Default**: `generate-completions`

#### `messages`
Object containing the messages to be used in the Cli, to override the default ones defined by this library. This enables internationalization and customization of cli-native messages. You can see a use-case in this [intl-cli example](/examples/intl-cli)</br>
**Default**: defined in [/src/cli-messages](/src/cli-messages.ts) and [/src/cli-errors](/src/cli-errors.ts)

