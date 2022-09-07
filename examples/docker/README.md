## Example executions:

```shell
# Show available options and namespaces
node docker.js -h

# Print application version
node docker.js -v

# Show help for "buider" namespace
node docker.js builder -h

# Show help for "build" command inside "builder" namespace
node docker.js builder build -h

# Execute "build" command (default options)
node docker.js builder build

# Execute "prune" command with options
node docker.js builder prune --all --filter until=24 -f true --keep-storage 100
```
