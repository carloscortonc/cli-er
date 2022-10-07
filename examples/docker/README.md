## Example executions:

```shell
# Show available options and namespaces (since 0.2.0)
node docker.js -h

# Print application version (since 0.4.0)
node docker.js -v

# Show help for "buider" namespace (since 0.2.0)
node docker.js builder -h

# Show help for "build" command inside "builder" namespace (since 0.2.0)
node docker.js builder build -h

# Show suggestions when spelling error occurs (since v0.5.0)
node docker.js builder builds

# Execute "build" command (default options)
node docker.js builder build

# Execute "prune" command with wrong value for keepStorage option
node docker.js builder prune --all --filter until=24 -f true --keep-storage yes

# Execute "prune" command with correct options
node docker.js builder prune --all --filter until=24 -f true --keep-storage 100

# Print error when unknown option is provided (since v0.5.0)
node docker.js builder prune --test
```
