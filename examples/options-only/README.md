Currently, CLIs with only options can be built in two ways:

- Using a main cli file (`options-only.js` in this case) to define the options, and an `index.js` containing the default function export that will receive the parsed options.
- Avoid `Cli.run`, using `Cli.parse` instead, which will return the parsed options.

The benefit of the first is that it includes some common features (automanaged help and version options, error checking) that the second lacks, while
the second might seem cleaner with a single code file.

## Example executions:

```shell
# Use the default "path" value, aka cwd (Option.value since v0.6.0)
node options-only.js

# Provide "path" option with a relative value (Option.value since v0.6.0)
node options-only.js --path ..
```
