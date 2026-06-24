Using `debug` utility for debug-logs

## Example executions:

```shell
# Only enable "cli" namespace logs
DEBUG=cli node cli.js

# Enable all cli* ("cli" and "cli::2")
DEBUG=cli* node cli.js

# Discard stderr to only view stdout ("Cli!")
DEBUG=cli node cli.js 2>/dev/null
```
