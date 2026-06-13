Example of using hooks for logging and global authentication:

- `afterParse` to log what command is being executed (using ctx.location)
- `beforeExecution` as auth-middleware, validating the same env value is present
- `afterExecution` to log command-execution errors

## Example executions:

```shell
# afterParse logs info
EXAMPLE_AUTH_TOKEN=1 node auth.js status

# afterExecution checks for errors and logs them
node auth.js status
```
