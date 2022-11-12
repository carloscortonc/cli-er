CLIs with only options can be built by defining an index script file. Here we export the default function that contains the cli logic, and also invoke `Cli.run()`, only when the script is directly called by node. For this we can use:

```js
if (require.main === module) {
  // invoke run method
}
```

## Example executions:

```shell
# Use the default "path" value, aka cwd (Option.value since v0.6.0)
node index.js

# Provide "path" option with a relative value (Option.value since v0.6.0)
node index.js --path ..

# Provide wrong value for "opt" option
node index.js --opt two
# Check exit code on windows-cmd
echo %ERRORLEVEL%
# Check exit code on linux/windows-powershell
echo $?
```
