CLIs with only options can be built with a single script file. Here we export the default function that contains the cli logic, and also invoke `Cli.run()`, only when the script is directly called by node. For this we can use:

```js
if (require.main === module) {
  // invoke run method
}
```

## Example executions:

```shell
# Use the default "path" value, aka cwd (Option.value since v0.6.0)
node options-only.js

# Provide "path" option with a relative value (Option.value since v0.6.0)
node options-only.js --path ..

# Provide wrong value for "opt" option
node options-only.js --opt two
# Check exit code on windows-cmd
echo %ERRORLEVEL%
# Check exit code on linux/windows-powershell
echo $?

# Print help from secondary cli-app: name is overriden (CliOptions.cliName since v0.7.0)
node secondary-cli.js -h
```
